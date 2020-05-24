import request from 'supertest';
import express from 'express';
import Station from './Station';

describe('Station api', () => {
  it('should test get', done => {
    const app = express();
    app.use(Station);
    request(app).get('/').expect(200, done);
  });

  it('should test post', done => {
    const app = express();
    app.use(Station);
    request(app).put('/').expect(200, done);
  });

  it('should test put', done => {
    const app = express();
    app.use(Station);
    request(app).put('/').expect(200, done);
  });

  it('should test delete', done => {
    const app = express();
    app.use(Station);
    request(app).delete('/').expect(200, done);
  });
});
