import request from 'supertest';
import express from 'express';
import Reading from './Reading';

describe('Reading api', () => {
  it('should test get', done => {
    const app = express();
    app.use(Reading);
    request(app).get('/').expect(200, done);
  });

  it('should test post', done => {
    const app = express();
    app.use(Reading);
    request(app).post('/').expect(200, done);
  });
});
