import SENSOR_TYPES from '../constants';

/* eslint-disable-next-line max-len */
const ipAddress = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const isIP = ip => ipAddress.test(ip);

const validateReadingParams = params => {
  if (!params.stationId) {
    return { error: 'Station id required' };
  }
  if (!params.sensorId) {
    return { error: 'Sensor id required' };
  }
  if (!params.timestamp) {
    return { error: 'Timestamp required' };
  }
  if (params.value === undefined || params.value === null) {
    return { error: 'Value required' };
  }
  return {};
};

const validateActionParams = params => {
  if (!params.stationId) {
    return { error: 'Station id required' };
  }
  if (!params.sensorId) {
    return { error: 'Sensor id required' };
  }
  if (!params.condition) {
    return { error: 'Condition required' };
  }
  if (!params.action) {
    return { error: 'Action required' };
  }
  if (!params.interval) {
    return { error: 'Interval required' };
  }
  return {};
};

const validateSensorParams = params => {
  if (!params.name) {
    return { error: 'Sensor name required' };
  }
  if (!params.stationId) {
    return { error: 'Station id required' };
  }
  if (!params.type) {
    return { error: 'Sensor type required' };
  }
  if (!SENSOR_TYPES.includes(params.type)) {
    return { error: 'Invalid sensor type' };
  }

  return {};
};

const validateStationParams = params => {
  if (!params.name) {
    return { error: 'Station name required' };
  }
  if (!params.ip) {
    return { error: 'Station ip required' };
  }
  if (!isIP(params.ip)) {
    return { error: 'IP Address must be valid' };
  }
  return {};
};

export {
  validateReadingParams,
  validateActionParams,
  validateSensorParams,
  validateStationParams,
  isIP,
};