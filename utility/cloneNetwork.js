import fetch from 'node-fetch';

// This is to get around the missing first 5 ids
const dummyStations = [
  { name: 'dummy1', address: '123.123.123.123', port: 80, sensors: [] },
  { name: 'dummy2', address: '123.123.123.123', port: 80, sensors: [] },
  { name: 'dummy3', address: '123.123.123.123', port: 80, sensors: [] },
  { name: 'dummy4', address: '123.123.123.123', port: 80, sensors: [] },
  { name: 'dummy5', address: '123.123.123.123', port: 80, sensors: [] },
];

/* eslint-disable no-await-in-loop */
const cloneNetwork = async () => {
  console.info('begining clone');
  const stations = await fetch('http://192.168.1.132:3000/api/station').then(res => res.json());
  const sensorArray = [];
  for (const station of [...dummyStations, stations].flat()) {
    await fetch('http://localhost:3000/api/station', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: station.name,
        address: station.address,
        port: station.port,
      }),
    });

    for (const sensor of station.sensors) {
      await fetch('http://localhost:3000/api/sensor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sensor,
        }),
      });
      sensorArray.push(sensor);
    }
  }

  console.info(`found ${sensorArray.length} sensors, pulling readings from all of them.`);

  let counter = 0;
  const readings = [];
  for (const sensor of sensorArray) {
    readings.push(
      await fetch(
        `http://192.168.1.132:3000/api/reading?sensorId=${sensor.id}&start=2020-01-01`,
      ).then(res => res.json()),
    );
    counter++;
    if (counter % 10 === 0) {
      console.info(`readings for ${counter} sensors have been pulled`);
    }
  }

  const flatReadings = readings.flat();

  console.info(`cloning ${flatReadings.length} readings`);

  counter = 0;
  for (const reading of flatReadings) {
    await fetch('http://localhost:3000/api/reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stationId: reading.stationId,
        sensorId: reading.sensorId,
        timestamp: reading.timestamp,
        value: reading.value,
      }),
    });
    counter++;
    if (counter % 1000 === 0) {
      console.info(`${counter} readings have been added to the local database`);
    }
  }

  console.info('job complete!');
};

cloneNetwork();
