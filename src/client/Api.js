import { objectToString } from './utilities/Window';

// Use API class for anything that should cache its result,
// otherwise use static functions
class Api {
  readings = {};

  async getStations() {
    if (this.stations) {
      return this.stations;
    }
    const stations = await fetch('/api/station').then(res => res.json());
    this.stations = stations;
    return stations;
  }

  async getDashboards() {
    if (this.dashboards) {
      return this.dashboards;
    }
    const dashboards = await fetch('/api/dashboard').then(res => res.json());
    this.dashboards = dashboards;
    return dashboards;
  }

  async getReadings(kwargs) {
    const stringifiedKwargs = JSON.stringify(kwargs);
    if (this.readings[stringifiedKwargs]) {
      return this.readings[stringifiedKwargs];
    }
    const readings = await fetch(`/api/reading?${objectToString(kwargs)}`).then(res => res.json());
    this.readings[stringifiedKwargs] = readings;
    return readings;
  }
}

const testStation = body =>
  fetch('/api/station/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(res => res.json());

const addStation = body =>
  fetch('/api/station/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(res => res.json());

const addBulkReadings = readings =>
  fetch('/api/reading/bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      readings,
    }),
  }).then(res => res.json());

const addDashboard = body =>
  fetch('/api/dashboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(res => res.json());

const deleteAction = id =>
  fetch(`/api/action/${id}`, {
    method: 'DELETE',
  });

const createAction = body =>
  fetch('/api/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(res => res.json());

const updateAction = body =>
  fetch('/api/action', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(res => res.json());

const listSensors = (address, port) => fetch(`/list?ip=${address}:${port}`).then(res => res.json());

const testSensor = body =>
  fetch('/api/sensor/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(res => res.json());

const addSensor = body =>
  fetch('/api/sensor/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(res => res.json());

const updateSensor = body =>
  fetch('/api/sensor', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      body,
    }),
  }).then(res => res.json());

export {
  updateSensor,
  addSensor,
  testSensor,
  listSensors,
  updateAction,
  createAction,
  deleteAction,
  addDashboard,
  addBulkReadings,
  addStation,
  testStation,
};
export default new Api();
