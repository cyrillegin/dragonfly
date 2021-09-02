import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import Action from './Action';

jest.mock('../db', () => ({
  Action: {
    findAll: () => {},
    create: () => {},
    destroy: () => {},
  },
}));

describe('Action api', () => {
  let console;

  beforeEach(() => {
    console = global.console;
    global.console = {
      info: jest.fn(),
      debug: jest.fn(),
    };
  });

  afterEach(() => {
    global.console = console;
  });

  it('should test post', done => {
    const app = express();
    app.use(bodyParser.json());
    app.use(Action);

    Promise.all([
      request(app).post('/').send({}).expect(400),
      request(app)
        .post('/')
        .send({
          stationId: 'test',
          sensorId: 'test',
          condition: 'test',
          action: 'test',
          interval: 'test',
          value: 'test',
        })
        .expect(200),
    ]).then(() => done());
  });

  it('should test delete', done => {
    const app = express();
    app.use(Action);
    Promise.all([
      request(app).delete('/').expect(404),
      request(app).delete('/id=1').expect(200),
    ]).then(() => done());
  });
});
