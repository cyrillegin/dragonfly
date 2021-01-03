import request from 'supertest';
import express from 'express';
import Reading from './Reading';

jest.mock('../db', () => ({
  Reading: {
    findAll: () => new Promise(res => res([])),
  },
}));

describe('Reading api', () => {
  it('should test get', done => {
    const app = express();
    app.use(Reading);

    const expectations = [
      request(app).get('/').expect(400),
      request(app).get('/?sensorId=1').expect(200),
      request(app).get(`/?sensorId=1&start=${new Date()}`).expect(200),
      request(app).get(`/?sensorId=1&end=${new Date()}`).expect(200),
      request(app)
        .get(`/?sensorId=1&start=${new Date('01-01-2001')}&end=${new Date('01-01-2000')}`)
        .expect(200),
      request(app)
        .get(`/?sensorId=1&start=${new Date('01-01-2000')}&end=${new Date('01-01-2001')}`)
        .expect(200),
    ];

    Promise.all(expectations).then(() => done());
  });

  it.skip('should test post', done => {
    const app = express();
    app.use(Reading);
    request(app).post('/').expect(200, done);
  });
});
