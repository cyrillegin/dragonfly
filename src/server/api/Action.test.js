import request from 'supertest';
import express from 'express';
import Action from './Action';

describe('Action api', () => {
  it('should test post', done => {
    const app = express();
    app.use(Action);
    request(app).post('/').expect(200, done);
  });

  it('should test delete', done => {
    const app = express();
    app.use(Action);
    request(app).delete('/').expect(200, done);
  });
});
