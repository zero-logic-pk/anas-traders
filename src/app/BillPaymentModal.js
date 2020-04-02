import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { sumBy } from 'lodash';
import ShopService from '../db/ShopService';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap';
import moment from 'moment';
import swal from 'sweetalert';

import BillService from '../db/BillService';

const defaultBillModal = {
    id: 0,
    totalAmount: 0,
    receivedAmount: 0.0,
    remainingAmount: 0.0,
    payment: {
        id: 0,
        dueOn: '',
        paidOn: '',
        amount: 0.0
    }
};

class BillPaymentModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bill: { ...defaultBillModal },
            shops: [{ id: 0, name: '' }],
            shopService: new ShopService(),
            billService: new BillService()
        };
    }

    componentDidMount() {
        Promise.all([this.state.shopService.getShops()]).then(
            successResponse => this.setState({ shops: successResponse[0] }),
            errorResponse => console.error(errorResponse)
        );

        this.state.bill.id && this.getData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.billId != this.state.billId) {
            this.setState(
                {
                    bill: { ...defaultBillModal, id: nextProps.billId }
                },
                this.getData
            );
        }
    }

    onFormFieldUpdate = event => {
        const { value: updatedValue, name: fieldName } = event.target;

        this.setState(previousState => {
            return {
                bill: {
                    ...previousState.bill,
                    payment: {
                        ...previousState.bill.payment,
                        [fieldName]: updatedValue
                    }
                }
            };
        });
    };

    onFormSubmit = () => {
        console.log(this.state.bill);

        if (this.state.bill.payment.amount > this.state.bill.remainingAmount) {
            swal({
                title: 'Incorrect Amount',
                text:
                    'Received amount must be less than or equal to remaining amount.',
                icon: 'error'
            });
            return;
        }

        const fn = this.state.bill.payment.id
            ? this.state.billService.addPayment
            : this.state.billService.addPayment;

        fn(this.state.bill.payment, this.state.bill.id).then(
            () => {
                swal({
                    title: 'Success',
                    text: `Bill Payment ${
                        this.state.bill.id ? 'updated' : 'added'
                    } successfully.`,
                    icon: 'success'
                }).then(this.props.modalCloseCallback);
            },
            errorResponse => {
                console.error(errorResponse);
                swal({
                    title: 'Erorr',
                    text: `An erorr occurred while ${
                        this.state.bill.id ? 'updating' : 'adding'
                    } bill payment.`,
                    icon: 'error'
                });
            }
        );
    };

    getData = () => {
        if (!this.state.bill.id) return;

        Promise.all([
            this.state.billService.getById(this.state.bill.id),
            this.state.billService.getBillPayments(this.state.bill.id)
        ]).then(
            successResponse => {
                const bill = successResponse[0];
                const receivedAmount =
                    sumBy(successResponse[1], 'paidAmount') || 0;

                this.setState({
                    bill: {
                        ...this.state.bill,
                        totalAmount: bill.amount,
                        receivedAmount,
                        remainingAmount: bill.amount - receivedAmount,
                        payment: {
                            ...this.state.bill.payment,
                            dueOn: bill.dueOn,
                            paidOn: moment().format('YYYY-MM-DD')
                        }
                    }
                });
                console.log(successResponse[1]);
            },
            errorResponse => console.error(errorResponse)
        );
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={this.props.modalCloseCallback}
                className={this.props.className}>
                <ModalHeader toggle={this.props.modalCloseCallback}>
                    {this.state.bill.payment.id ? 'Update' : 'Add'} Bill Payment
                </ModalHeader>

                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="dueOn">Due On</Label>
                            <Input
                                type="date"
                                name="dueOn"
                                readOnly={true}
                                value={this.state.bill.payment.dueOn}
                                onChange={this.onFormFieldUpdate}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="paidOn">Paid On</Label>
                            <Input
                                type="date"
                                name="paidOn"
                                max={moment().format('YYYY-MM-DD')}
                                value={this.state.bill.payment.paidOn}
                                onChange={this.onFormFieldUpdate}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="totalAmount">Bill Total Amount</Label>
                            <Input
                                type="number"
                                name="totalAmount"
                                value={this.state.bill.totalAmount}
                                readOnly={true}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="paidAmont">Received</Label>
                            <Input
                                type="number"
                                name="paidAmont"
                                value={this.state.bill.receivedAmount}
                                readOnly={true}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="remainingAmount">Remaining</Label>
                            <Input
                                type="number"
                                name="remainingAmount"
                                value={this.state.bill.remainingAmount}
                                readOnly={true}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="amount">Amount</Label>
                            <Input
                                type="number"
                                name="amount"
                                min="0"
                                max={this.state.bill.remainingAmount}
                                value={this.state.bill.payment.amount}
                                onChange={this.onFormFieldUpdate}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <Button
                        type="button"
                        color="secondary"
                        onClick={this.props.modalCloseCallback}>
                        Cancel
                    </Button>{' '}
                    <Button
                        type="submit"
                        color="primary"
                        onClick={this.onFormSubmit}>
                        {this.state.bill.payment.id ? 'Update' : 'Add'}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

BillPaymentModal.propTypes = {
    isOpen: PropTypes.bool,
    className: PropTypes.string,
    modalCloseCallback: PropTypes.func,
    billId: PropTypes.number
};

export default BillPaymentModal;
