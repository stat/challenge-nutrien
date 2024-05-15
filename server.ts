// reqs
const dotenv = require('dotenv');
const csv = require('csv-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

// env
dotenv.config();

const envDataPath = process.env.DATA_PATH || 'data/projection.csv'
const envDBName = process.env.DB_NAME || 'projection'
const envPort = process.env.PORT || 3000;

// db
const db = new sqlite3.Database(`:${envDBName}:`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }

  console.log('Connected to the in-memory SQLite database.');
});

// authN
const authN = (req, res, next) => {
  const isAuthorized = true;

  // TODO: validate credentials

  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("unauthorized");
  }
};

// express
const app = express();

// views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));

// route
app.get('/:commodity/histogram', authN, (req, res) => {
  const data = { }
  res.render('histogram', data);
});

// route
app.get('/:commodityType/histogram', authN, (req, res) => {
  const data = { }
  res.render('histogram', data);
});

// load
const rs = fs.createReadStream(envDataPath);

console.log(`Loading ${envDataPath}`);

rs.pipe(csv())
  .on('headers', (headers) => {
    console.log(headers);
  })
  .on('data', (data) => {
    console.log(data);
  })

// http server
app.listen(envPort, () => {
  console.log(`Server is running at http://localhost:${envPort}`);
});
