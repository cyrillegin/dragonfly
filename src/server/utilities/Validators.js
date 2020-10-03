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
  if (!params.hardwareName) {
    return { error: 'Hardware name required' };
  }

  return {};
};

const validateStationParams = params => {
  const { name, ipaddress } = params;
  if (!name) {
    return { error: 'Station name required' };
  }
  if (!ipaddress) {
    return { error: 'Station ip required' };
  }
  let address;
  let port = 80;
  if (ipaddress === 'self') {
    address = '127.0.0.1';
    port = process.env.SERVER_PORT;
  } else if (ipaddress.indexOf(':') > 0) {
    [address, port] = ipaddress.split(':');
  } else {
    address = ipaddress;
  }
  if (!isIP(address)) {
    return { error: 'IP Address must be valid' };
  }
  return {
    name,
    ipaddress: `${address}${port === 80 ? '' : `:${port}`}`,
  };
};

export {
  validateReadingParams,
  validateActionParams,
  validateSensorParams,
  validateStationParams,
  isIP,
};
