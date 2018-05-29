import uuid
import base64


def short_uuid():
    u = getattr(uuid, 'uuid1')()
    return base64.b64encode(u.bytes, "-_")[:-2]


def decode_uuid(id):
    return uuid.UUID(bytes=base64.b64decode(id + '==', '-_'))
