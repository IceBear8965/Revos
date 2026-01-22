import json
import logging

logger = logging.getLogger("activity")


def log_event(action: str, user_id: int, extra: dict = None, level: str = "info"):
    payload = {
        "action": action,
        "user_id": user_id,
        "extra": extra or {},
    }

    if level == "info":
        logger.info(json.dumps(payload))
    elif level == "error":
        logger.error(json.dumps(payload))
    else:
        logger.debug(json.dumps(payload))
