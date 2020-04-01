import BaseService from './BaseService';

export default class ShopService extends BaseService {
    getShops = () => this.runAllQuery('SELECT * FROM "shop" ORDER BY `name`;');

    addShop = updatedData =>
        this.runStatement('INSERT INTO "shop" (name, address) VALUES(?, ?);', [
            updatedData.name,
            updatedData.address
        ]);

    updateShop = updatedData =>
        this.runStatement(
            'UPDATE "shop" SET name = ?, address = ? WHERE id = ?;',
            [updatedData.name, updatedData.address, updatedData.id]
        );

    removeShops = shopIds =>
        this.runStatement(
            `DELETE FROM "shop" WHERE id IN (${new Array(shopIds.length)
                .fill('?')
                .join(',')});`,
            shopIds
        );
}
