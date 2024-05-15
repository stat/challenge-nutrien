//
// Imports
//

import csv from 'csv-parser';
import dotenv from 'dotenv';
import express, {Express, Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import url from 'url';
import sql from 'sqlite3';

//
// Interfaces
//

interface Projection {
  attribute: string;
  commodity: string;
  commodityType: string;
  units: string;
  year: Date;
  yearType: string;
  value: number;
};

//
// ENV
// 

dotenv.config();

//
// Constants
//

// env
const envDataPath = process.env.DATA_PATH || 'data/projection.csv'
const envPort = process.env.PORT || 3000;
const envDBName = process.env.DB_NAME || ':memory:';
const envDBTableName = process.env.DB_TABLE_NAME || 'data';

// app
const app = express();

// db
const db = new sql.Database(envDBName);

// pwd
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//
// Functions
//

/**
 * @param {string} name - the name of the table to create
 * @returns {Promise<void>}
 */
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

/**
 * @param {string} path - the location of the csv projection data
 * @returns {} the file stream
 */
export function csvStream(path:string) {
  const rs = fs.createReadStream(path);
  const stream = rs.pipe(csv());

  return stream;
}

/**
 * @param {string} query - the query to execute
 * @returns {Promise<void>}
 */
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

/**
 * @param {Request} req - the express request object
 * @param {Response} res - the express response object
 * @param {Function} next - the next func in the middleware stack
 * @returns {void}
 */
function expressAuthN(req:Request, res:Response, next:Function):void {
  const isAuthorized = true;

  // TODO: validate credentials

  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("unauthorized");
  }
};

/**
 * @param {Express} app - the express application
 * @returns {void}
 */
function expressConfig(app:Express):void {
  // views
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views/pages'));
}

/**
 * @param {Express} app - the express application
 * @returns {void}
 */
function expressRoutes(app:Express):void {
  // route
  app.get('/:commodity/histogram', expressAuthN, (req:Request, res:Response) => {
    const data = { }
    res.render('histogram', data);
  });

  // route
  app.get('/:commodityType/histogram', expressAuthN, (req:Request, res:Response) => {
    const data = { }
    res.render('histogram', data);
  });
}

/**
 * @param {Express} app - the express application
 * @returns {void}
 */
function expressServe(app:Express):void {
  // server
  app.listen(envPort, () => {
    console.log(`Server is running at http://localhost:${envPort}`);
  });
}

/**
 * @param {string} path - the location of the csv projection data
 * @returns {Promise<Array<Projection>>} the contents of the csv file
 */
function loadData(path:string, db:sql.Database, table:string):Promise<Array<Projection>> {
  return new Promise<Array<Projection>>((resolve, reject) => {
  });
}

//
// Initialize
//

async function initialize() {
  // create the table
  await createTable(envDBTableName);

  //  load data into the table
  await loadData(envDataPath, db, envDBTableName);
}



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

