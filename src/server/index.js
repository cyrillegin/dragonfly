import './env';
import 'regenerator-runtime/runtime';
import path from 'path';
import { fork } from 'child_process';
import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';
import api from './api';
import './db';

const app = express();

app.use(express.static(path.join(__dirname, '/public/')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/health', (req, res) => res.sendStatus(200));

app.get('/list', (req, res) => {
  fetch(`http://${req.query.ip}/list`)
    .then(response => response.json())
    .then(response => res.send(response));
});

app.use(express.json({ type: ['application/*+json', 'application/json'] }));
app.use(api);

// TODO: Import error of db
fork('./dist/health-check.js');

app.listen(process.env.SERVER_PORT, () => {
  console.info(`App started on port ${process.env.SERVER_PORT}`);
});
