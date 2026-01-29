import json
from datetime import datetime

def load_schedule(path="config/schedule.json"):
    with open(path, "r") as f:
        return json.load(f)

def time_in_range(start, end, current):
    return start <= current <= end

def get_current_phase(schedule):
    now = datetime.now().strftime("%H:%M")

    for phase, config in schedule.items():
        if not config.get("enabled", True):
            continue

        if time_in_range(config["start"], config["end"], now):
            return phase

    return None
