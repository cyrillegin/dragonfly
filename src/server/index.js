import "regenerator-runtime/runtime";
const express = require('express');
const path = require('path')
const app = express();
const api = require('./api');

app.use(express.static(path.join(__dirname + '/public/')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})
app.get('/health', (req, res) => res.sendStatus(200));

app.use(express.json());

app.use(api);

const server = app.listen(3000, () => {
  console.log(`App started on port ${3000}`);
});
