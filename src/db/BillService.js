import moment from 'moment';

import BaseService from './BaseService';

export default class BillService extends BaseService {
    getAll = () =>
        this.runAllQuery(`
            SELECT b.id, b.createdOn, b.dueOn, b.amount, b.shopId, s.name as shopName, b.agentId, a.name as agentName,
            (SELECT SUM(bp.paidAmount) FROM bill_payment AS bp WHERE bp.billId = b.id) AS paidAmount
            FROM bill AS b
            JOIN agents AS a on b.agentId = a.id
            JOIN shop AS s on b.shopId = s.id
            ORDER BY shopName;
        `);

    getById = billId =>
        this.executeQuery('SELECT * FROM bill WHERE id=?;', [billId]);

    add = billToAdd =>
        this.runStatement(
            'INSERT INTO bill (shopId, agentId, amount, createdOn, dueOn) VALUES(?, ?, ?, ?, ?);',
            [
                billToAdd.shopId,
                billToAdd.agentId,
                billToAdd.amount,
                moment().format('YYYY-DD-MM'),
                billToAdd.dueOn
            ]
        );

    update = updatedBill =>
        this.runStatement(
            'UPDATE "bill" SET dueOn=?, amount=?, shopId=?, agentId=? WHERE id=?',
            [
                updatedBill.dueOn,
                updatedBill.amount,
                updatedBill.shopId,
                updatedBill.agentId,
                updatedBill.id
            ]
        );

    delete = billIds =>
        this.runStatement(
            `DELETE FROM bill WHERE id IN (${new Array(billIds.length)
                .fill('?')
                .join(', ')})`,
            billIds
        );

    getBillPayments = billId =>
        this.runAllQuery('SELECT * FROM bill_payment WHERE billId=?;', [
            billId
        ]);

    addPayment = (payment, billId) =>
        this.runStatement(
            'INSERT INTO bill_payment (billId, dueOn, paidOn, paidAmount, isPaid) VALUES (?, ?, ?, ?, ?)',
            [
                billId,
                payment.dueOn,
                payment.paidOn,
                payment.amount,
                payment.amount > 0 ? 1 : 0
            ]
        );
}
