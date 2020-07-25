import fetch from 'node-fetch';

const kitchenStation = {
  name: 'FIXTURE - kitchen station',
  ipaddress: '127.0.0.1',
};

const fishStation = {
  name: 'FIXTURE - fish station',
  ipaddress: '127.0.0.1',
};

const ovenSensor = {
  name: 'FIXTURE - Oven',
  hardwareName: 'temperature',
};

const fridgeSensor = {
  name: 'FIXTURE - Fridge',
  hardwareName: 'temperature',
};

const tankSensor = {
  name: 'FIXTURE - Fish tank',
  hardwareName: 'temperature',
};

const lightSwitch = {
  name: 'FIXTURE - Fish lights',
  hardwareName: 'switch',
};

const slackAction = {
  condition: '>',
  action: 'slack',
  interval: '5m',
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

const doPut = async (api, updates) => {
  const res = await fetch(`http://localhost:3000/api/${api}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  const json = await res.json();
  if (json.error) {
    console.info('got error');
    console.info(json.error);
    process.exit(1);
  } else {
    console.error(`${api} updated successfully`);
  }
};

const setupFixtures = async () => {
  // create kitchenStation
  await doPost('station', kitchenStation);

  // create fish station
  await doPost('station', fishStation);

  // Get stations
  let stations = await doGet('station');

  // create oven sensor
  ovenSensor.stationId = stations[0].id;
  await doPost('sensor', ovenSensor);

  // create fridge sensor
  fridgeSensor.stationId = stations[0].id;
  await doPost('sensor', fridgeSensor);

  // create tank sensor
  tankSensor.stationId = stations[1].id;
  await doPost('sensor', tankSensor);

  // create light switch
  lightSwitch.stationId = stations[1].id;
  await doPost('sensor', lightSwitch);

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
  const singleGraph = true;
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
      timestamp: new Date(Date.now() - 1000 * index),
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

    if (index % 100 === 0) {
      console.info(`${index} / ${points} readings have been added`);
    }
  }
};

setupFixtures();
