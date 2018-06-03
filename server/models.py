from sqlalchemy import Column, Integer, Text, ForeignKey, Float, BigInteger, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Sensor(Base):

    __tablename__ = "sensor"

    uuid = Column(String, index=True, primary_key=True)
    created = Column(BigInteger)
    modified = Column(BigInteger)
    name = Column(Text)
    description = Column(Text)
    coefficients = Column(Text)
    units = Column(Text)
    station = Column(Text)
    poller = Column(Text)
    pin = Column(Text)
    endpoint = Column(Text)
    # TODO: make this an enum
    # offline, online, error
    status = Column(Text)

    def toDict(self):
        return {
            "uuid": self.uuid,
            "created": self.created,
            "modified": self.modified,
            "name": self.name,
            "description": self.description,
            "coefficients": self.coefficients,
            "units": self.units,
            "station": self.station,
            "poller": self.poller,
            "pin": self.pin,
            "endpoint": self.endpoint,
            "status": self.status
        }


class Reading(Base):

    __tablename__ = "reading"

    uuid = Column(String, index=True, primary_key=True)
    timestamp = Column(BigInteger)
    sensor = Column(Text, ForeignKey('sensor.uuid'))
    value = Column(Float)

    def toDict(self):
        return {
            "uuid": self.uuid,
            "timestamp": self.timestamp,
            "sensor": self.sensor,
            "value": self.value
        }
