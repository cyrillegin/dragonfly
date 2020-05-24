import request from 'supertest';
import express from 'express';
import Sensor from './Sensor';

describe('Sensor api', () => {
  it('should test post', done => {
    const app = express();
    app.use(Sensor);
    request(app).put('/').expect(200, done);
  });

  it('should test put', done => {
    const app = express();
    app.use(Sensor);
    request(app).put('/').expect(200, done);
  });

  it('should test delete', done => {
    const app = express();
    app.use(Sensor);
    request(app).delete('/').expect(200, done);
  });
});
