import request from 'supertest';
import express from 'express';
import Reading from './Reading';

jest.mock('../db', () => ({
  Reading: {
    findAll: () => {},
  },
}));

describe('Reading api', () => {
  it('should test get', done => {
    const app = express();
    app.use(Reading);
    request(app).get('/?sensorId=1').expect(200, done);
  });

  it.skip('should test post', done => {
    const app = express();
    app.use(Reading);
    request(app).post('/').expect(200, done);
  });
});
