#!/usr/bin/env python3
"""PostToolUse gate: render the figure Claude just wrote, log it, hand back what broke.

FAIL (the construction threw, so the board never built) blocks the tool result,
because there is nothing to look at and Claude has to fix it. WARN is injected as
context instead: the audit's rules are judgement calls, and the refit.py workflow
legitimately leaves D5 loose between its two passes.

JSX_GATE=0 keeps the render and the log but never blocks -- that is the arm that
measures first-attempt quality, and unlike disableAllHooks it still records what
happened.
"""

import json
import os
import re
import shutil
import subprocess
import sys
import time
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _evallog import append, base, digest, read_records  # noqa: E402

RENDER_TIMEOUT = 120
CREATE_CALL = re.compile(r"""create\(\s*['"]([A-Za-z]+)['"]""")


def emit(obj):
    print(json.dumps(obj))
    sys.exit(0)


def gating() -> bool:
    return os.environ.get("JSX_GATE", "1").lower() not in ("0", "false", "no", "off")


try:
    event = json.load(sys.stdin)
except Exception:
    sys.exit(0)

path = (event.get("tool_input") or {}).get("file_path") or ""
figure = Path(path).resolve()
if figure.name != "figure.js" or not figure.is_file():
    sys.exit(0)

folder = figure.parent
root = Path(os.environ.get("CLAUDE_PROJECT_DIR") or folder.parent.parent)
render = root / "figures" / "render.py"
uv = shutil.which("uv") or str(Path.home() / ".local/bin/uv")
if not render.is_file() or not Path(uv).is_file():
    sys.exit(0)

body = figure.read_text(encoding="utf-8", errors="replace")
started = time.monotonic()
try:
    proc = subprocess.run(
        [uv, "run", "--with", "playwright", "python", str(render), folder.name],
        cwd=root, capture_output=True, text=True, timeout=RENDER_TIMEOUT,
    )
except Exception as exc:
    emit({"systemMessage": f"render_check: render.py did not run ({exc})"})
elapsed_ms = round((time.monotonic() - started) * 1000)

out = proc.stdout.strip()
head, *rest = out.splitlines() if out else ["", ]
detail = [line.strip() for line in rest]
status = "fail" if head.startswith("FAIL") else "warn" if head.startswith("WARN") else \
         "ok" if head.startswith("ok") else "error"

# attempt_idx counts this figure's earlier writes in the same run, which is the
# axis a repair loop is measured on: attempt 0 is what the model produced with no
# feedback at all, and everything after it is the harness talking back.
prior = [r for r in read_records(event)
         if r.get("event") == "figure_render" and r.get("figure") == folder.name]

record = base(event, "figure_render")
record.update({
    "figure": folder.name,
    "attempt_idx": len(prior),
    "tool_name": event.get("tool_name"),
    "status": status,
    "render_ms": elapsed_ms,
    "code_len": len(body),
    "code_sha256": digest(body)[:16],
    # Counted in the source, not in the board: these are the create() calls the
    # model wrote, so a helper in _lib.js that fans out to several elements shows
    # up once. Real per-element counts would have to come out of render.py's AUDIT.
    "figure_create_calls": dict(Counter(CREATE_CALL.findall(body))),
    "js_errors": detail if status == "fail" else [],
    "structural_warnings": detail if status == "warn" else [],
    "png_path": str((folder / "render.png").relative_to(root)),
    "gated": gating(),
})
if status == "error":
    record["renderer_stderr"] = (proc.stderr or out).strip()[-1200:]
    record["returncode"] = proc.returncode

try:
    append(event, record)
except Exception:
    pass

joined = "\n".join(detail)

if status == "error":
    emit({"systemMessage": f"render_check: render.py exited {proc.returncode}\n"
                           f"{(proc.stderr or out).strip()[-1200:]}"})

if status == "fail" and gating():
    emit({
        "decision": "block",
        "reason": (
            f"{folder.name}/figure.js threw while the board was building, so the figure "
            f"did not render:\n{joined}\nFix figure.js and write it again."
        ),
    })

if status == "warn" and gating():
    emit({
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": (
                f"figures/render.py rendered {folder.name} and its audit reports:\n{joined}\n"
                f"The rule ids are sections of figures/PROMPT-RULES.md. "
                f"The render is at figures/{folder.name}/render.png."
            ),
        }
    })
