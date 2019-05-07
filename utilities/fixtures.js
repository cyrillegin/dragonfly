import request from 'request';

Date.prototype.subtractMinutes = function(t) {
  this.setTime(this.getTime() - t * 1000 * 60);
  return this;
};

const makeRequest = (station, sensor, i) => {
  if (i <= 0) {
    return;
  }
  if (i % 100 === 0) {
    console.log(station, sensor, i);
  }
  const date = new Date();
  date.subtractMinutes(i);
  const options = {
    uri: 'http://localhost:3000/api/reading',
    method: 'POST',
    json: true,
    body: {
      value: Math.sin(i * 0.01),
      timestamp: date.getTime(),
      sensorName: sensor,
      stationName: station,
    },
  };

  request(options, () => {
    makeRequest(station, sensor, i - 1);
  });
};

const loadSensorData = async (station, sensor) => {
  makeRequest(station, sensor, 24 * 60);
};

loadSensorData('kitchen', 'temp');
loadSensorData('fish tank', 'temp');
loadSensorData('outside', 'wind');
// setTimeout(() => {
//   loadSensorData('outside', 'temp');
//   loadSensorData('outside', 'rain');
// }, 1000);
