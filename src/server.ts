//
// Imports
//

import dotenv from 'dotenv';
import express, {Express, Request, Response} from 'express';
import sql from 'sqlite3';

import {createTable, distinctWithCount} from './dao.js'
import {loadData} from './loader.js'

//
// ENV
// 

dotenv.config();

//
// Constants
//

// env
const dataPath = process.env.DATA_PATH || './data/projection.csv'
const dbName = process.env.DB_NAME || ':memory:';
const dbTableName = process.env.DB_TABLE_NAME || 'data';
const httpPort = process.env.HTTP_PORT || 3000 ;

// app
export const app = express();

// db
export const db = new sql.Database(dbName);

//
// Functions
//

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
  app.set('views', './views/pages');
  // path.join(__dirname, '../views/pages'));
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
  app.listen(httpPort, () => {
    console.log(`Server is running at http://localhost:${httpPort}`);
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
