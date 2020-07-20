import './env';
import 'regenerator-runtime/runtime';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import api from './api';
import './db';
const { fork } = require('child_process');

const app = express();

app.use(express.static(path.join(__dirname, '/public/')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/health', (req, res) => res.sendStatus(200));

app.use(express.json({ type: ['application/*+json', 'application/json'] }));
app.use(api);

//fork('./dist/health-check.js')

app.listen(3000, () => {
  console.info(`App started on port ${3000}`);
});
