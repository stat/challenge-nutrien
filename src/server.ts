//
// Imports
//

import {parse} from 'csv-parse';
import dotenv from 'dotenv';
import express, {Express, Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import url from 'url';
import sql from 'sqlite3';

import {createTable, distinctWithCount, insertRow } from './dao.js'

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
const dataPath = process.env.DATA_PATH || 'data/projection.csv'
const dbName = process.env.DB_NAME || ':memory:';
const dbTableName = process.env.DB_TABLE_NAME || 'data';
const port = process.env.PORT || 3000;

// app
export const app = express();

// db
export const db = new sql.Database(dbName);

// pwd
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//
// Functions
//


/**
 * @param {string} path - the location of the csv projection data
 * @returns {} the file stream
 */
export function csvStream(path:string) {
  const rs = fs.createReadStream(path);
  const stream = rs.pipe(parse({columns: true})); //{cast: true, columns: true}));

  return stream;
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
  app.set('views', path.join(__dirname, '../views/pages'));
}

/**
 * @param {Express} app - the express application
 * @returns {void}
 */
function expressRoutes(app:Express):void {
  // route
  app.get('/Commodity/histogram', expressAuthN, async (req:Request, res:Response) => {
    const data = await distinctWithCount(db, dbTableName, "Commodity");
    res.render('histogram', {data: data});
  });

  // route
  app.get('/CommodityType/histogram', expressAuthN, async (req:Request, res:Response) => {
    const data = await distinctWithCount(db, dbTableName, "CommodityType");
    res.render('histogram', {data: data});
  });
}

/**
 * @param {Express} app - the express application
 * @returns {void}
 */
function expressServe(app:Express):void {
  // server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

/**
 * @param {string} path - the location of the csv projection data
 * @param {sql.Database} db - the sqlite3 db
 * @param {string} table - the name of the table to load into
 * @returns {Promise<Number>} the number of rows inserted
 */
function loadData(path:string, db:sql.Database, table:string):Promise<Number> {
  return new Promise<Number>((resolve, reject) => {
    let count = 0;

    db.serialize(() => {
    csvStream(path)
      .on('data', (row:Map<string, any>) => {
        insertRow(db, table, row)
          .then(() => {
            count++;
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      })
      .on("close", function (err:Error) {
        reject(err);
      })
      .on("end", function () {
        resolve(count);
      });
    });
  });
}

//
// Initialize
//

async function initialize() {
  // create the table
  try {
    console.log("creating in memory table");
    await createTable(db, dbTableName);
  } catch(e) {
    console.error(e);
  }

  // load data into the table
  try {
    console.log("loading data...");
    const count = await loadData(dataPath, db, dbTableName);
    console.log(`loaded ${count} rows`);
  } catch(e) {
    console.error(e);
  }

  // configure express
  expressConfig(app);

  // attach routes
  expressRoutes(app);
}

//
// Serve
//

export async function serve() {
  await initialize();
  expressServe(app);
}
