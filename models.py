from sqlalchemy import Column, Integer, Text, BigInteger, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
# possible sensor types:
# temperature: displays a gauge graph
# cleanliness: shows a beaker with varying degrees of water color
# lightsensor: shows a sun animation
# lightswitch: shows a lightbulb
Base = declarative_base()


class Sensor(Base):

    __tablename__ = "sensor"

    created = Column(BigInteger, index=True)
    name = Column(Text, primary_key=True)
    description = Column(Text)
    coefficients = Column(Text)
    sensor_type = Column(Text)
    units = Column(Text)
    last_reading = Column(Float)
    min_value = Column(Integer)
    max_value = Column(Integer)

    def toDict(self):
        return {
            "created": self.created,
            "name": self.name,
            "description": self.description,
            "coefficients": self.coefficients,
            "self_type": self.sensor_type,
            "units": self.units,
            "lastReading": self.last_reading,
            "min_value": self.min_value,
            "max_value": self.max_value
        }


class Reading(Base):

    __tablename__ = "reading"

    created = Column(BigInteger, primary_key=True)
    sensor = Column(Text, ForeignKey('sensor.name'), index=True)
    value = Column(Integer)

    def toDict(self):
        return {
            "created": self.created,
            "sensor": self.sensor,
            "value": self.value
        }


class Log(Base):

    __tablename__ = "log"

    created = Column(BigInteger, index=True, primary_key=True)
    title = Column(Text)
    description = Column(Text)

    def toDict(self):
        return {
            'created': self.created,
            'title': self.title,
            'description': self.description
        }


class User(Base):

    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    password = Column(Text, nullable=False)

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name
        }
