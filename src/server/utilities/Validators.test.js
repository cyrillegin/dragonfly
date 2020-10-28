import {
  validateReadingParams,
  validateActionParams,
  validateSensorParams,
  validateStationParams,
  isIP,
} from './Validators';

describe('validators', () => {
  it('should test ip address', () => {
    ['test', '123', 123, {}, [], '123.123', '123.123.123', '923.123.123.123'].forEach(fakeIP => {
      expect(isIP(fakeIP)).toBeFalsy();
    });

    expect(isIP('123.123.123.123')).toBeTruthy();
  });

  it('should test reading validator', () => {
    const reading = {};
    expect(validateReadingParams(reading).error).toEqual('Station id required');

    reading.stationId = 'test';
    expect(validateReadingParams(reading).error).toEqual('Sensor id required');

    reading.sensorId = 'test';
    expect(validateReadingParams(reading).error).toEqual('Timestamp required');

    reading.timestamp = 'test';
    expect(validateReadingParams(reading).error).toEqual('Value required');

    reading.value = 'test';
    expect(validateReadingParams(reading).error).toBeFalsy();
  });

  it('should test action validator', () => {
    const action = {};
    expect(validateActionParams(action).error).toEqual('Station id required');

    action.stationId = 'test';
    expect(validateActionParams(action).error).toEqual('Sensor id required');

    action.sensorId = 'test';
    expect(validateActionParams(action).error).toEqual('Condition required');

    action.condition = 'test';
    expect(validateActionParams(action).error).toEqual('Action required');

    action.action = 'test';
    expect(validateActionParams(action).error).toEqual('Interval required');

    action.interval = 'test';
    expect(validateActionParams(action).error).toBeFalsy();
  });

  it('should test sensor validator', () => {
    const sensor = {};

    expect(validateSensorParams(sensor).error).toEqual('Sensor name required');

    sensor.name = 'test';
    expect(validateSensorParams(sensor).error).toEqual('Station id required');

    sensor.stationId = 'test';
    expect(validateSensorParams(sensor).error).toEqual('Hardware name required');

    sensor.hardwareName = 'test';
    expect(validateSensorParams(sensor).error).toEqual('Hardware type required');

    sensor.hardwareType = 'test';
    expect(validateSensorParams(sensor).error).toEqual('Reading type required');

    sensor.readingType = 'test';
    expect(validateSensorParams(sensor).error).toBeFalsy();
  });

  it('should test station validator', () => {
    const station = {};

    expect(validateStationParams(station).error).toEqual('Station name required');

    station.name = 'test';
    expect(validateStationParams(station).error).toEqual('Station ip required');

    station.address = 'test';
    expect(validateStationParams(station).error).toEqual('IP Address must be valid');

    station.address = '123.123.123.123';
    expect(validateStationParams(station).error).toBeFalsy();
  });
});
