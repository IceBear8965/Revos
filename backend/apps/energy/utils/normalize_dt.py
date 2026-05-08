def normalize_dt(dt):
    if dt is None:
        return None

    return dt.replace(microsecond=0)
