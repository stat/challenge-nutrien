//
// Imports
//

import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import sql from "sqlite3";

import { createTable, countRows, distinctWithCount } from "./dao";
import { loadData } from "./loader";

//
// ENV
//

dotenv.config();

//
// Constants
//

// env
const dataPath = process.env.DATA_PATH || "./data/projection.csv";
const dbName = process.env.DB_NAME || ":memory:";
const dbTableName = process.env.DB_TABLE_NAME || "data";
const httpPort = process.env.HTTP_PORT || 3000;

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
function authN(req: Request, res: Response, next: Function): void {
  const isAuthorized = true;

  // TODO: validate credentials

  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("unauthorized");
  }
}

/**
 * @param {Express} app - the express application
 * @returns {void}
 */
function config(app: Express): void {
  // views
  app.set("view engine", "ejs");
  app.set("views", "./views/pages");
  // path.join(__dirname, '../views/pages'));
}

/**
 * @param {Express} app - the express application
 * @returns {void}
 */
function routes(app: Express): void {
  // route
  app.get(
    "/Commodity/histogram",
    authN,
    async (req: Request, res: Response) => {
      const data = await distinctWithCount(db, dbTableName, "Commodity");
      res.render("histogram", { data: data });
    }
  );

  // route
  app.get(
    "/CommodityType/histogram",
    authN,
    async (req: Request, res: Response) => {
      const data = await distinctWithCount(db, dbTableName, "CommodityType");
      res.render("histogram", { data: data });
    }
  );
}

/**
 * @param {Express} app - the express application
 * @returns {void}
 */
function serve(app: Express): void {
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
  await createTable(db, dbTableName);

  // parse csv and load into db
  const loading = await loadData(dataPath, db, dbTableName);
  console.log(`loading ${loading} rows...`);

  // ensure db data
  const loaded = await countRows(db, dbTableName);

  if (loaded != loading) {
    throw new Error(
      `Could not load CSV data, found ${loading} rows, loaded: ${loaded} rows`
    );
  }

  console.log(`successfully loaded ${loaded} rows!`);

  // configure express
  config(app);

  // attach routes
  routes(app);
}

//
// Start
//

export async function start() {
  await initialize();
  serve(app);
}
