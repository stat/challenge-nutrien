import {parse} from 'csv-parse';
import fs from 'fs';
import sql from 'sqlite3';

import {insertRow} from './dao.js'

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
 * @returns {Promise<Number>} the number of rows inserted
 */
export function loadData(path:string, db:sql.Database, table:string):Promise<Number> {
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
