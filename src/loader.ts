import {parse} from 'csv-parse';
import fs from 'fs';
import sql from 'sqlite3';

import {insertRow} from './dao.js'
import {runQuery} from './db.js'

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
 * @param {string} path - the location of the csv projection data
 * @param {sql.Database} db - the sqlite3 db
 * @param {string} table - the name of the table to load into
 * @returns {Promise<Number>} the number of rows being loaded
 */
export function loadData(path:string, db:sql.Database, table:string):Promise<Number> {
  return new Promise<Number>((resolve, reject) => {
    let loading = 0;

    csvStream(path)
      .on('data', async (row:Map<string, any>) => {
        loading++;
        insertRow(db, table, row);
      })
      .on("error", function(err:Error) {
        reject(err);
      })
      .on("close", function (err:Error) {
        reject(err);
      })
      .on("end", function () {
        resolve(loading);
      });
  });
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
