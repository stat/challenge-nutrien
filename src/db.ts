import sql from 'sqlite3';

/**
 * @param {string} query - the query to execute
 * @returns {Promise<void>}
 */
export function executeQuery(db:sql.Database, query: string): Promise<void> {
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
 * @param {string} query - the query to execute
 * @returns {Promise<void>}
 */
export function runQuery(db:sql.Database, query: string, ...args:any): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(query, args, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
