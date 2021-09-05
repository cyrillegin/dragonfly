import { objectToString } from './utilities/Window';

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

  static testStation(body) {
    return fetch('/api/station/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(res => res.json());
  }

  static addStation(body) {
    return fetch('/api/station/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(res => res.json());
  }

  async getDashboards() {
    if (this.dashboards) {
      return this.dashboards;
    }
    const dashboards = await fetch('/api/dashboard').then(res => res.json());
    this.dashboards = dashboards;
    return dashboards;
  }

  static addDashboard(body) {
    return fetch('/api/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(res => res.json());
  }

  static deleteAction(id) {
    return fetch(`/api/action/${id}`, {
      method: 'DELETE',
    });
  }

  static createAction(body) {
    return fetch('/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(res => res.json());
  }

  static updateAction(body) {
    return fetch('/api/action', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(res => res.json());
  }

  static listSensors(address, port) {
    return fetch(`/list?ip=${address}:${port}`).then(res => res.json());
  }

  static testSensor(body) {
    return fetch('/api/sensor/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(res => res.json());
  }

  static addSensor(body) {
    return fetch('/api/sensor/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(res => res.json());
  }

  static updateSensor(body) {
    return fetch('/api/sensor', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body,
      }),
    }).then(res => res.json());
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

  static addBulkReadings(body) {
    return fetch('/api/reading/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body,
      }),
    });
  }
}

export default new Api();
