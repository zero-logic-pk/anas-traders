import * as path from 'path';
const sqlite3 = require('sqlite3').verbose();

class BaseService {
    constructor() {
        const isDevelopment = process.env.NODE_ENV !== 'production';
        this.dbFilePath = isDevelopment
            ? path.resolve(__dirname, 'anas-traders.db')
            : 'anas-traders.db';
        this.db = null;
    }

    openDatabase = () => {
        this.db = new sqlite3.Database(this.dbFilePath, err => {
            if (err) {
                return console.error(err);
            }
        });

        this.db.on('trace', query => console.log(query));
    };

    closeDatabase = () => {
        this.db.close(err => {
            if (err) {
                return console.error(err.message);
            }
        });
    };

    runAllQuery = query => {
        return new Promise((resolve, reject) => {
            this.openDatabase();

            this.db.all(query, (err, rows) => {
                if (err) reject(err);

                const data = (rows && [...rows]) || [];

                this.closeDatabase();
                resolve(data);
            });
        });
    };

    prepareStatement = (query, reject) => {
        this.openDatabase();

        return this.db.prepare(query, err => {
            if (err) {
                this.closeDatabase();
                reject(err);
            }
        });
    };

    runStatement = (statement, resolve, reject) => {
        statement.finalize(err => {
            this.closeDatabase();
            if (!err) {
                resolve();
            } else reject(err);
        });
    };
}

export default BaseService;
