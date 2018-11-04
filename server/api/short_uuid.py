import uuid


def short_uuid():
    u = getattr(uuid, 'uuid1')()
    return str(u)
