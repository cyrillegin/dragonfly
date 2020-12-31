import fetch from 'node-fetch';

const balconyStation = {
  name: 'FIXTURE - balcony station',
  address: '127.0.0.1',
  port: '3001',
};

const balconyBMPTemp = {
  name: 'FIXTURE - temperature',
  hardwareName: 'temperature_balcony',
  hardwareType: 'bmp',
  readingType: 'temperature',
};

const balconyBMPPres = {
  name: 'FIXTURE - pressure',
  hardwareName: 'pressure_balcony',
  hardwareType: 'bmp',
  readingType: 'pressure',
};

const balconyBMPAlt = {
  name: 'FIXTURE - altitude',
  hardwareName: 'altitude_balcony',
  hardwareType: 'bmp',
  readingType: 'altitude',
};

const fishStation = {
  name: 'FIXTURE - fish station',
  address: '127.0.0.1',
  port: '3001',
};

const tankSensor = {
  name: 'FIXTURE - Fish tank',
  hardwareName: 'temperature_fish',
  hardwareType: 'gpio',
  readingType: 'temperature',
};

const lightSwitch = {
  name: 'FIXTURE - Fish lights',
  hardwareName: 'switch_fist',
  hardwareType: 'unknown',
  readingType: 'unknown',
};

const slackAction = {
  condition: '>',
  action: 'slack',
  interval: '5m',
  value: 5,
};

const diskSpace = {
  name: 'FIXTURE - Disk space',
  hardwareName: 'cpu',
  hardwareType: 'cpuPoller',
  readingType: 'temperatures',
};

const doPost = async (api, data) => {
  const res = await fetch(`http://localhost:3000/api/${api}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (json.error) {
    console.error('got error');
    console.error(json.error);
    process.exit(1);
  }
};

const doGet = async api => {
  const res = await fetch(`http://localhost:3000/api/${api}`);
  const json = await res.json();
  return json;
};

// const doPut = async (api, updates) => {
//   const res = await fetch(`http://localhost:3000/api/${api}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(updates),
//   });
//
//   const json = await res.json();
//   if (json.error) {
//     console.info('got error');
//     console.info(json.error);
//     process.exit(1);
//   } else {
//     console.error(`${api} updated successfully`);
//   }
// };

const setupFixtures = async () => {
  // create kitchenStation
  await doPost('station', balconyStation);

  // create fish station
  await doPost('station', fishStation);

  // Get stations
  let stations = await doGet('station');

  // create temp sensor
  balconyBMPTemp.stationId = stations[0].id;
  await doPost('sensor', balconyBMPTemp);

  // create pressure sensor
  balconyBMPPres.stationId = stations[0].id;
  await doPost('sensor', balconyBMPPres);

  // create alt sensor
  balconyBMPAlt.stationId = stations[0].id;
  await doPost('sensor', balconyBMPAlt);

  // create tank sensor
  tankSensor.stationId = stations[1].id;
  await doPost('sensor', tankSensor);

  // create light switch
  lightSwitch.stationId = stations[1].id;
  await doPost('sensor', lightSwitch);

  // create cpu poller
  diskSpace.stationId = stations[1].id;
  await doPost('sensor', diskSpace);

  stations = await doGet('station');

  // add actions
  slackAction.stationId = stations[0].id;
  slackAction.sensorId = stations[0].sensors[0].id;
  await doPost('action', slackAction);

  slackAction.sensorId = stations[0].sensors[1].id;
  await doPost('action', slackAction);

  slackAction.stationId = stations[1].id;
  slackAction.sensorId = stations[1].sensors[0].id;
  await doPost('action', slackAction);

  slackAction.stationId = stations[1].id;
  slackAction.sensorId = stations[1].sensors[1].id;
  await doPost('action', slackAction);

  // create readings
  let points = 1440;
  const singleGraph = false;
  if (singleGraph) {
    points *= 10;
  }
  for (let index = 0; index < points; index++) {
    // Breaks up a the period of a sin curve over 1440 points (1 day)
    const seed = Math.PI * index * 0.001388;

    // base reading
    const reading = {
      stationId: stations[0].id,
      sensorId: stations[0].sensors[0].id,
      timestamp: new Date(Date.now() - 1000 * index * 60),
      value: Math.sin(seed) * 100,
    };

    // oven sensor
    await doPost('reading', reading);

    if (singleGraph) {
      if (index % 100 === 0) {
        console.info(`${index} / ${points} readings have been added`);
      }
      continue;
    }

    // fridge sensor
    reading.sensorId = stations[0].sensors[1].id;
    reading.value = Math.cos(seed) * 100;
    await doPost('reading', reading);

    // tank sensor
    reading.stationID = stations[1].id;
    reading.sensorId = stations[1].sensors[0].id;
    reading.value = Math.sin(seed) * 50;
    await doPost('reading', reading);

    // light sensor
    reading.sensorId = stations[1].sensors[1].id;
    reading.value = Math.sin(seed * 10) * 100 > 0 ? 1 : 0;
    await doPost('reading', reading);

    // cpu sensor
    reading.sensorId = stations[1].sensors[2].id;
    reading.value = Math.sin(seed) * 50 ** 8;
    await doPost('reading', reading);

    if (index % 100 === 0) {
      console.info(`${index} / ${points} readings have been added`);
    }
  }
};

setupFixtures();
