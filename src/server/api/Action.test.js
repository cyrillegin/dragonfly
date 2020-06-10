import request from 'supertest';
import express from 'express';
import Action from './Action';

jest.mock('../db', () => ({
  Action: {
    findAll: () => {},
  },
}));

describe('Action api', () => {
  it.skip('should test post', done => {
    const app = express();
    app.use(Action);
    request(app).post('/').expect(200, done);
  });

  it.skip('should test delete', done => {
    const app = express();
    app.use(Action);
    request(app).delete('/').expect(200, done);
  });
});
