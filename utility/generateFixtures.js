import fetch from 'node-fetch';

const newStation = {
  name: 'new station',
  ip: '123.123.123.123',
};

const newSensor = {
  name: 'new sensor',
  stationId: 1,
  type: 'temperature',
  description: 'new sensor',
  coefficients: '9/5, 32',
  on: true,
};

const doPost = async (api, data) => {
  const res = await fetch(`http://localhost:3000/api/${api}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (json.error) {
    console.info('got error');
    console.info(json.error);
    process.exit(1);
  } else {
    console.error(`${api} added successfully`);
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

const deleteStation = async id => {
  const res = await fetch(`http://localhost:3000/api/stations?id=${id}`, {
    method: 'DELETE',
  });

  const json = await res.json();
  if (json.error) {
    console.error('got error');
    console.error(json.error);
    process.exit(1);
  } else {
    console.info(json.message);
  }
};

const setupFixtures = async () => {
  // doPost('stations', newStation);
  const stations = await doGet('stations');
  console.log(stations[0]);
  // newSensor.stationId = stations[0].id;
  // doPost('sensors', newSensor);
};

setupFixtures();
