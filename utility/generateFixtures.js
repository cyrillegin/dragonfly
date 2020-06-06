import fetch from 'node-fetch';

const kitchenStation = {
  name: 'kitchen station',
  ip: '123.123.123.123',
};

const fishStation = {
  name: 'fish station',
  ip: '123.123.123.124',
};

const ovenSensor = {
  name: 'Oven',
  type: 'temperature',
};

const fridgeSensor = {
  name: 'Fridge',
  type: 'temperature',
};

const tankSensor = {
  name: 'Fish tank',
  type: 'temperature',
};

const lightSwitch = {
  name: 'Fish lights',
  type: 'switch',
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
  } else {
    console.info(`${api} added successfully`);
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
  await doPost('stations', kitchenStation);
  // create fish station
  await doPost('stations', fishStation);
  // Get stations
  let stations = await doGet('stations');

  // create oven sensor
  ovenSensor.stationId = stations[0].id;
  await doPost('sensors', ovenSensor);
  // create fridge sensor
  fridgeSensor.stationId = stations[0].id;
  await doPost('sensors', fridgeSensor);

  // create tank sensor
  tankSensor.stationId = stations[1].id;
  await doPost('sensors', tankSensor);
  // create light switch
  lightSwitch.stationId = stations[1].id;
  await doPost('sensors', lightSwitch);

  stations = await doGet('stations');

  // create readings
  const date = new Date();
  for (let i = 0; i < 100; i++) {
    date.setDate(date.getDate() - 1);
    // over sensor
    const reading = {
      stationId: stations[0].id,
      sensorId: stations[0].sensors[0].id,
      timestamp: date,
      value: Math.sin(i) * 100,
    };
    await doPost('readings', reading);

    // fridge sensor
    reading.sensorId = stations[0].sensors[1].id;
    reading.value = Math.cos(i) * 100;
    await doPost('readings', reading);

    // tank sensor
    reading.stationID = stations[1].id;
    reading.sensorId = stations[1].sensors[0].id;
    reading.value = Math.sin(i) * 50;
    await doPost('readings', reading);

    // light sensor
    reading.sensorId = stations[1].sensors[1].id;
    reading.value = Math.sin(i) * 100 + 50 > 50 ? 1 : 0;
    await doPost('readings', reading);
  }
};

setupFixtures();
