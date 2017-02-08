from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import String, Integer
from sqlalchemy.orm import relationship
from base import Base


class Sensor(Base):

    __tablename__ = 'sensor'

    id = Column(Integer, primary_key=True)
    name = Column(String())
    units = Column(String())
    coefficients = Column(String())


class Reading(Base):
    __tablename__ = 'reading'

    id = Column(Integer, primary_key=True)
    value = Column(String())
    time = Column(String())
    sensor = Column(ForeignKey('sensor.id'))
