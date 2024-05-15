// reqs
// const dotenv = require('dotenv');
// const csv = require('csv-parser');
// const express = require('express');
// const fs = require('fs');
// const sqlite3 = require('sqlite3');

import csv from 'csv-parser';
import dotenv from 'dotenv';
import express, {Express, Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import url from 'url';
import sql from 'sqlite3';

// import {csvColumns} from './loader.js';

// const path = require('path');
// const url = require('url');
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

// env
dotenv.config();

const envDataPath = process.env.DATA_PATH || 'data/projection.csv'
const envPort = process.env.PORT || 3000;

// db
// const db = sqlite.open({
//   filename: ":memory:",
//   driver: sqlite3.cached.Database
// });

// if (db) {
//   console.log('Connected to the in-memory SQLite database.');
// } else {
//   console.log('Could not connect to the in-memory SQLite database.');
// }

const db = new sql.Database(':memory:');
const dbTableName = 'data';

function executeQuery(query: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.exec(query, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function createTable(name:string):Promise<void> {
  return executeQuery(`
    CREATE TABLE IF NOT EXISTS ${name}
    (
      attribute VARCHAR(64),
      commodity VARCHAR(64),
      commodity_type VARCHAR(64),
      units VARCHAR(64),
      year TIMESTAMP,
      year_type VARCHAR(64),
      value NUMERICAL
    )`
  );
}

await createTable(dbTableName);

// function initializeDB() {
//   return new Promise(function(resolve, reject) {
//     const db = new sqlite3.Database(':memory:', (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(db);
//       }
//     });
//   });
// }

// const db2 = new sqlite.Database(`:${envDBName}:`, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
//   if (err) {
//     console.error(err.message);
//   }

//   console.log('Connected to the in-memory SQLite database.');
// });

// authN
const authN = (req:Request, res:Response, next:Function) => {
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
app.get('/:commodity/histogram', authN, (req:Request, res:Response) => {
  const data = { }
  res.render('histogram', data);
});

// route
app.get('/:commodityType/histogram', authN, (req:Request, res:Response) => {
  const data = { }
  res.render('histogram', data);
});

// load
// const rs = fs.createReadStream(envDataPath);



//
// db.serialize(() => {
//   rs.pipe(csv())
//     .on('headers', (headers) => {
//       console.log(headers);

//       db.run(`CREATE TABLE IF NOT EXISTS ${dbTableName}`, (err) => {

//         if (err) {
//           console.error('Error creating table:', err.message);
//           rs.destroy();
//         }
//       });

//       console.log(`Table '${dbTableName}' created successfully.`);
//     })
//     .on('data', (data) => {
//       // console.log(data);
//     })
//     .on("close", function (err:Error) {
//       console.log("Unsuccessfully loaded data");
//     })
//     .on("end", function () {
//       console.log("Successfully loaded data");
//     });
// });

// // http server
// app.listen(envPort, () => {
//   console.log(`Server is running at http://localhost:${envPort}`);
// });

