import '@babel/polyfill';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import './dotenv';
import DB from './db';
import addModelsToContext from './models';

(async () => {
  // Wait for DB connection to complete before allowing HTTP connections
  const db = await DB.connect();

  // Apply validators and indexes
  await addModelsToContext({ db }, { applyValidatorsAndIndexes: true });

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  // TODO: learn more about this, this isnt for prod?
  app.use(
    require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }),
  );

  // Connect to database
  app.use(async (req, res, next) => {
    req.context = await addModelsToContext({ db });
    next();
  });

  // Set headers for gzip
  app.get('*.gz', (req, res, next) => {
    res.set('Content-Type', 'application/javascript');
    res.set('Content-Encoding', 'gzip');
    next();
  });

  // This sets where all the public files can be served from.
  app.use(express.static(path.join(process.env.PWD, 'dist/server/public')));

  // This will catch all incoming requests to the server
  // and redirect it to the index.html created by angular.
  // If new routes are needed, make sure to add them above this line.
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.env.PWD, 'dist/server/public/index.html'));
  });

  const port = process.env.PORT || '8080';
  app.set('port', port);

  // const server = http.createServer(app);

  app.listen(port, () => console.log(`Site running on localhost:${port}`));
})();
