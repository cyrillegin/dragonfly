import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import Sensor from './Sensor';

jest.mock('../db', () => ({
  Sensor: {
    findAll: () => {},
    count: () => 1,
    update: () => {},
    create: () => {},
    destroy: () => {},
  },
  Reading: {
    destroy: () => {},
  },
  Action: {
    destroy: () => {},
  },
}));

xdescribe('Sensor api', () => {
  it('should test post', done => {
    const app = express();
    app.use(bodyParser.json());
    app.use(Sensor);

    Promise.all([
      request(app).post('/').expect(400),
      request(app)
        .post('/')
        .send({
          name: 'test',
          stationId: 'test',
          hardwareName: 'test',
          hardwareType: 'test',
          readingType: 'test',
        })
        .expect(200),
    ]).then(() => done());
  });

  it('should test put', done => {
    const app = express();
    app.use(bodyParser.json());
    app.use(Sensor);

    Promise.all([
      request(app).put('/').expect(400),
      request(app)
        .put('/')
        .send({
          id: 'test',
        })
        .expect(200),
    ]).then(() => done());
  });

  it('should test delete', done => {
    const app = express();
    app.use(Sensor);
    Promise.all([
      request(app).delete('/').expect(400),
      request(app)
        .delete('/?id=1')

        .expect(200),
    ]).then(() => done());
  });
});
