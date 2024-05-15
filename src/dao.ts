import sql from 'sqlite3';

import {executeQuery, runQuery} from './db.js'

/**
 * @param {string} name - the name of the table to create
 * @returns {Promise<void>}
 */
export function createTable(db:sql.Database, name:string):Promise<void> {
  return executeQuery(
    db,
    `CREATE TABLE IF NOT EXISTS ${name}
    (
      attribute VARCHAR(64),
      commodity VARCHAR(64),
      commodity_type VARCHAR(64),
      units VARCHAR(64),
      year_type VARCHAR(64),
      year VARCHAR(64),
      value NUMERICAL
    )`
  );
}

/**
 * @param {sql.Database} db - the sqlite3 db
 * @param {string} table - the name of the table to load into
 * @param {Array<any>} data - the data to load
 * @returns {Promise<Number>} the number of rows inserted
 */
export function insertRow(db:sql.Database, table:string, data:Array<any>):Promise<void> {
  // TODO: add column count validation
  
  if (!(data[6] instanceof Number)) {
    data[6] = Number(data[6]);
  }

  return runQuery(
    db,
    `INSERT INTO ${table}
    (
      attribute,
      commodity,
      commodity_type,
      units,
      year_type,
      year,
      value
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ...data
  )
}

