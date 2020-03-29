import BaseService from './BaseService';

export default class ShopService extends BaseService {
    getShops = () => this.runAllQuery('SELECT * FROM "shop" ORDER BY `name`;');

    addShop = updatedData => {
        return new Promise((resolve, reject) => {
            const statement = this.prepareStatement(
                'INSERT INTO "shop" (name, address) VALUES(?, ?);',
                reject
            );
            statement.run(updatedData.name, updatedData.address);
            this.runStatement(statement, resolve, reject);
        });
    };

    updateShop = updatedData => {
        return new Promise((resolve, reject) => {
            const statement = this.prepareStatement(
                'UPDATE "shop" SET name = ?, address = ? WHERE id = ?;',
                reject
            );
            statement.run(
                updatedData.name,
                updatedData.address,
                updatedData.id
            );
            this.runStatement(statement, resolve, reject);
        });
    };

    removeShops = shopIds => {
        return new Promise((resolve, reject) => {
            const statement = this.prepareStatement(
                `DELETE FROM "shop" WHERE id IN (${new Array(shopIds.length)
                    .fill('?')
                    .join(',')});`,
                reject
            );

            statement.run(shopIds);
            this.runStatement(statement, resolve, reject);
        });
    };
}
