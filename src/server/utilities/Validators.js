const ipAddress =
  /* eslint-disable-next-line max-len */
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
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

const validateDashboardParams = params => {
  if (!params.name) {
    return { error: 'Dashboard name required' };
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
  if (!params.hardwareName) {
    return { error: 'Hardware name required' };
  }
  if (!params.hardwareType) {
    return { error: 'Hardware type required' };
  }
  if (!params.readingType) {
    return { error: 'Reading type required' };
  }
  return {};
};

const validateSensorPollRate = pollRate => {
  const [, time, unit] = pollRate.split(/(\d+)/);
  if (Number.isNaN(parseInt(time, 10))) {
    return { error: 'Time value not found in pollRate' };
  }
  if (!unit) {
    return { error: 'Time unit not found in pollRate' };
  }
  if (!['s', 'm', 'h', 'd'].includes(unit)) {
    return { error: 'Incorrect time unit, available units include: "s", "m", "h", "d"' };
  }
  return { success: 'success' };
};

const validateStationParams = params => {
  const { name, address, port } = params;
  if (!name) {
    return { error: 'Station name required' };
  }
  if (!address) {
    return { error: 'Station ip required' };
  }

  if (!isIP(address)) {
    return { error: 'IP Address must be valid' };
  }
  return {
    name,
    address,
    port: port || 80,
  };
};

export {
  validateReadingParams,
  validateActionParams,
  validateSensorParams,
  validateStationParams,
  validateSensorPollRate,
  validateDashboardParams,
  isIP,
};
