// CronDao
const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

class CronDao {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE, err => {
            if (err) {
                console.error(err.message);
            }	
            console.log("Connected to the db for update");
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.run(sql, params, function (err) {
            if (err) {
              console.log('Error running sql ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve({ id: this.lastID })
            }
          })
        })
      }
}

module.exports = CronDao