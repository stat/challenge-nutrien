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
      Attribute VARCHAR(64),
      Commodity VARCHAR(64),
      CommodityType VARCHAR(64),
      Units VARCHAR(64),
      YearType VARCHAR(64),
      Year VARCHAR(64),
      Value NUMERICAL
    )`
  );
}

/**
 * @param {sql.Database} db - the sqlite3 db
 * @param {string} table - the name of the table to load into
 * @param {Array<any>} data - the data to load
 * @returns {Promise<Number>} the number of rows inserted
 */
export function insertRow(db:sql.Database, table:string, data:any):Promise<void> {
  // TODO: add column count validation

  const value = data['Value'];

  if (!(value instanceof Number)) {
    data['Value'] =  Number(value);
  }

  const columns = Object.keys(data).join(', ');
  const values = Object.values(data)
    .map((value) => {
      return typeof value === 'string' ? `'${value}'` : value
    })
    .join(', ');

  const query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;

  return runQuery(db, query)
}

interface DistinctWithCount {
  count: string;
  name: string;
}

//
// Queries
//

export async function countRows(db:sql.Database, table:string):Promise<Number> {
  return new Promise<Number>((resolve, reject) => {
    db.all(
    `SELECT COUNT(*) from ${table}`,
    (err, rows) => {
      const row:any = rows[0];
      const result = row['COUNT(*)'];

      resolve(result);
    });
  });
}

export async function distinctWithCount(db:sql.Database, table:string, column:string):Promise<Array<DistinctWithCount>> {
  return new Promise<Array<DistinctWithCount>>((resolve, reject) => {
    // let result:Array<DistinctWithCount> = [];

    db.all(`
    SELECT DISTINCT
      ${column},
      COUNT(*) as count
    FROM
      ${table}
    GROUP BY
      ${column}
    ORDER BY
      ${column} ASC`,
    (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const result = rows.map((item:any) => {
        return {count: item['count'], name: item[column]};
      });

      // rows.forEach((row:any) => {
      //   result.push({count: row['count'], name: row[column]});
      // });

      resolve(result);
    });
  });
}
