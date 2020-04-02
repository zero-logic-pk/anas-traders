import * as path from 'path';
import sqlite from 'sqlite';

class BaseService {
    constructor() {
        this.dbFilePath =
            process.env.NODE_ENV !== 'production'
                ? path.resolve(__dirname, 'anas-traders.db')
                : 'anas-traders.db';
    }

    openDatabase = async () => {
        const db = await sqlite.open(this.dbFilePath, {
            promise: Promise,
            verbose: true
        });

        db.on('trace', query => console.log(query));

        return db;
    };

    runAllQuery = async (query, params) => {
        let db = null;
        try {
            db = await this.openDatabase();

            const rows = await db.all(query, params);

            return rows;
        } catch (error) {
            throw error;
        } finally {
            await db.close();
        }
    };

    executeQuery = async (query, params) => {
        let db = null;

        try {
            db = await this.openDatabase();

            const data = await db.get(query, params);

            return data;
        } catch (error) {
            throw error;
        } finally {
            await db.close();
        }
    };

    runStatement = async (query, params) => {
        let db = null;

        try {
            db = await this.openDatabase();

            const statement = await db.prepare(query, params);
            await statement.run();
            await statement.finalize();
        } catch (error) {
            throw error;
        } finally {
            await db.close();
        }
    };
}

export default BaseService;