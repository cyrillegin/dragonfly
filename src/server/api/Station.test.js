import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import Station from './Station';

jest.mock('../db', () => ({
  Station: {
    findAll: () => new Promise(res => res([])),
    create: () => {},
    update: () => {},
    destroy: () => {},
  },
  Sensor: {
    destroy: () => {},
  },
  Reading: {
    destroy: () => {},
  },
  Action: {
    destroy: () => {},
  },
}));

describe('Station api', () => {
  let console;

  beforeAll(() => {
    console = global.console;
    global.console = { error: () => {}, info: () => {} };
  });

  afterAll(() => {
    global.console = console;
  });

  it('should test get', done => {
    const app = express();
    app.use(Station);

    Promise.all([
      request(app)
        .get('/')

        .expect(200),
    ]).then(() => done());
  });

  it('should test post', done => {
    const app = express();
    app.use(bodyParser.json());
    app.use(Station);

    Promise.all([
      request(app).post('/').expect(400),
      request(app)
        .post('/')
        .send({
          name: 'test',
          address: '192.168.0.1',
          port: '1234',
        })
        .expect(200),
    ]).then(() => done());
  });

  it('should test put', done => {
    const app = express();
    app.use(bodyParser.json());
    app.use(Station);

    Promise.all([
      request(app).put('/').expect(400),
      request(app)
        .put('/')
        .send({
          name: 'test',
          address: '192.168.0.1',
          port: '1234',
        })
        .expect(200),
    ]).then(() => done());
  });

  it('should test delete', done => {
    const app = express();
    app.use(Station);

    Promise.all([
      request(app).delete('/').expect(400),
      request(app)
        .delete('/?id=1')

        .expect(200),
    ]).then(() => done());
  });
});
