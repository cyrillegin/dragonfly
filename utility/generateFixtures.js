import fetch from 'node-fetch';

const newStation = {
  name: 'new station',
  ip: '123.123.123.123',
};

const addStation = async station => {
  const res = await fetch('http://localhost:3000/api/stations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStation),
  });

  const json = await res.json();

  if (json.error) {
    console.info('got error');
    console.info(json.error);
    process.exit(1);
  } else {
    console.error('station added successfully');
  }
};

const getStation = async () => {
  const res = await fetch('http://localhost:3000/api/stations');
  const json = await res.json();
  return json;
};

const updateStation = async updatedStation => {
  const res = await fetch('http://localhost:3000/api/stations', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStation),
  });

  const json = await res.json();
  if (json.error) {
    console.info('got error');
    console.info(json.error);
    process.exit(1);
  } else {
    console.error('station updated successfully');
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

const setupStation = async () => {
  await addStation(newStation);
  newStation.name = 'updatedStation';
  newStation.ip = '123.123.123.124';
  newStation.id = 1;

  await getStation();
  await updateStation(newStation);
  const stations = await getStation();
  await deleteStation(stations[0].id);
  await getStation();
};

setupStation();
