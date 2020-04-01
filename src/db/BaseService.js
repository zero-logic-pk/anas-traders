import * as path from 'path';
import sqlite from 'sqlite';

class BaseService {
    constructor() {
        const isDevelopment = process.env.NODE_ENV !== 'production';
        this.dbFilePath = isDevelopment
            ? path.resolve(__dirname, 'anas-traders.db')
            : 'anas-traders.db';
        this.db = null;
    }

    openDatabase = async () => {
        this.db = await sqlite.open(this.dbFilePath, {
            promise: Promise,
            verbose: true
        });

        this.db.on('trace', query => console.log(query));
    };

    closeDatabase = () => this.db.close();

    runAllQuery = async query => {
        try {
            await this.openDatabase();

            const rows = await this.db.all(query);

            return rows;
        } catch (error) {
            throw error;
        } finally {
            await this.db.close();
        }
    };

    runStatement = async (query, params) => {
        try {
            await this.openDatabase();
            
            const statement = await this.db.prepare(query, params);
            await statement.run();
            await statement.finalize();
        } catch (error) {
            throw error;
        } finally {
            await this.db.close();
        }
    };
}

export default BaseService;
