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
 * @returns {Promise<Number>} the number of rows inserted
 */
export function loadData(path:string, db:sql.Database, table:string):Promise<Number> {
  return new Promise<Number>((resolve, reject) => {
    let loading = 0;

    // db.serialize(() => {
    csvStream(path)
      .on('data', async (row:Map<string, any>) => {
        // try {
        //   await insertRow(db, table, row);
        //   completions++;
        // } catch(err) {
        //   reject(err);
        // }

        loading++;
        insertRow(db, table, row);

        // promise
        //   .then(() => {
        //     completions++;
        //   })
        //   .catch((err) => {
        //     errors.push(err);
        //   });

        // promises.push(promise);
      })
      .on("error", function(err:Error) {
        reject(err);
      })
      .on("close", function (err:Error) {
        reject(err);
      })
      .on("end", function () {
        // if (errors.length) {
        //   reject(errors);
        //   return;
        // }

        // console.log("promises:", promises.length);

        // Promise.all(promises)
        // .then(() => {
        //   resolve(completions);
        // })
        // .catch((err) => {
        //   reject(err);
        // });
        
        resolve(loading);
      });


  });
  // });
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

// export function coutRows(db:sql.Database, table:string):Promise<Number> {
//   const query = `select count(*) from ${table}`;

//   // return runQuery(db, query)
//   return new Promise<Number>((resolve, reject) => {

//   });
// }
