import request from 'supertest';
import express from 'express';
import Sensor from './Sensor';

jest.mock('../db', () => ({
  Sensor: {
    findAll: () => {},
  },
}));

describe('Sensor api', () => {
  it.skip('should test post', done => {
    const app = express();
    app.use(Sensor);
    request(app).put('/').expect(200, done);
  });

  it.skip('should test put', done => {
    const app = express();
    app.use(Sensor);
    request(app).put('/').expect(200, done);
  });

  it.skip('should test delete', done => {
    const app = express();
    app.use(Sensor);
    request(app).delete('/').expect(200, done);
  });
});
