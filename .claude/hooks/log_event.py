#!/usr/bin/env python3
"""Log one hook event as JSONL. Never blocks, never speaks to Claude.

Registered on every event worth reconstructing a run from. The payload is kept
whole rather than cherry-picked, so a new field in a future Claude Code release
lands in the log without this script being touched.
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _evallog import append, base, shrink  # noqa: E402

PROMOTED = {"session_id", "prompt_id", "agent_type", "permission_mode", "hook_event_name"}

try:
    event = json.load(sys.stdin)
except Exception:
    sys.exit(0)

record = base(event, event.get("hook_event_name") or "unknown")
record["payload"] = {k: shrink(v) for k, v in event.items() if k not in PROMOTED}

try:
    append(event, record)
except Exception:
    pass
sys.exit(0)
