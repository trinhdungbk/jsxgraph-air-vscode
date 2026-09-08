"""Shared JSONL sink for the figure-eval hooks.

One line per event under .claude/logs/<run_id>/events.jsonl. `run_id` comes from
JSX_RUN_ID so a batch driver can group every record a session produces with the
task it was handed; without it the session id stands in, which keeps interactive
work from landing in a batch's log.

Anything longer than MAX_INLINE is replaced by its length, a hash and a head, so
a record stays one short line. That matters: several hooks append concurrently,
and a single write below PIPE_BUF is what stops two events tearing each other.
"""

import fcntl
import hashlib
import json
import os
import time
from pathlib import Path

MAX_INLINE = 2000


def enabled() -> bool:
    return os.environ.get("JSX_LOG", "1").lower() not in ("0", "false", "no", "off")


def log_dir(event: dict) -> Path:
    root = Path(os.environ.get("CLAUDE_PROJECT_DIR") or Path.cwd())
    run = os.environ.get("JSX_RUN_ID") or f"sess-{str(event.get('session_id') or 'unknown')[:8]}"
    return root / ".claude" / "logs" / run


def digest(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", "replace")).hexdigest()


def shrink(value):
    if isinstance(value, str) and len(value) > MAX_INLINE:
        return {"_len": len(value), "_sha256": digest(value)[:16], "_head": value[:200]}
    if isinstance(value, dict):
        return {k: shrink(v) for k, v in value.items()}
    if isinstance(value, list):
        return [shrink(v) for v in value[:50]]
    return value


def base(event: dict, kind: str) -> dict:
    return {
        "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "ts_ns": time.time_ns(),
        "run_id": os.environ.get("JSX_RUN_ID"),
        "task_id": os.environ.get("JSX_TASK_ID"),
        "event": kind,
        "session_id": event.get("session_id"),
        "prompt_id": event.get("prompt_id"),
        "agent_type": event.get("agent_type"),
        "permission_mode": event.get("permission_mode"),
    }


def append(event: dict, record: dict) -> None:
    if not enabled():
        return
    path = log_dir(event) / "events.jsonl"
    path.parent.mkdir(parents=True, exist_ok=True)
    line = json.dumps(record, ensure_ascii=False, default=str) + "\n"
    with open(path, "a", encoding="utf-8") as fh:
        fcntl.flock(fh, fcntl.LOCK_EX)
        fh.write(line)
        fh.flush()
        fcntl.flock(fh, fcntl.LOCK_UN)


def read_records(event: dict) -> list:
    path = log_dir(event) / "events.jsonl"
    if not path.is_file():
        return []
    out = []
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        try:
            out.append(json.loads(line))
        except ValueError:
            pass
    return out
