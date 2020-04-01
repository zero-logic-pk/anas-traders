import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';

import BillService from '../db/BillService';
import AgentService from '../db/AgentService';
import ShopService from '../db/ShopService';
import swal from 'sweetalert';
import moment from 'moment';

class AddEditBillModal extends Component {
    constructor(props) {
        super(props);

        const { bill } = props;
        if (!bill.id) {
            bill.dueOn = moment().format('YYYY-MM-DD')
        }

        this.state = {
            bill,
            agents: [{ id: 0, name: '' }],
            shops: [{ id: 0, name: '' }],
            agentService: new AgentService(),
            shopService: new ShopService(),
            billService: new BillService()
        };
    }

    componentDidMount() {
        Promise.all([
            this.state.agentService.getAll(),
            this.state.shopService.getShops()
        ]).then(
            successResponses => {
                this.setState({
                    agents: successResponses[0],
                    shops: successResponses[1]
                });
            },
            errorResponse => console.error(errorResponse)
        );
    }

    componentWillReceiveProps(nextProps) {
        const { bill } = nextProps;
        if (bill && !bill.id) {
            bill.dueOn = moment().format('YYYY-MM-DD');
            bill.agentId = this.state.agents[0].id;
            bill.shopId = this.state.shops[0].id;
        }
        this.setState({ bill });
    }

    onFormFieldUpdate = event => {
        const { value: updatedValue, name: fieldName } = event.target;

        this.setState(previousState => {
            return {
                bill: {
                    ...previousState.bill,
                    [fieldName]: updatedValue
                }
            };
        });
    };

    onFormSubmit = () => {
        const fn = this.state.bill.id
            ? this.state.billService.update
            : this.state.billService.add;
        fn(this.state.bill).then(
            () => {
                swal({
                    title: 'Success',
                    text: `Bill ${
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
                    } bill.`,
                    icon: 'error'
                });
            }
        );
    };

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={this.props.modalCloseCallback}
                    className={this.props.className}>
                    <ModalHeader toggle={this.props.modalCloseCallback}>
                        Modal title
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <code>{JSON.stringify(this.state.bill)}</code>
                        </div>
                        <Form>
                            <FormGroup>
                                <Label for="shopId">Shop</Label>
                                <Input
                                    type="select"
                                    name="shopId"
                                    value={this.state.bill.shopId}
                                    onChange={this.onFormFieldUpdate}>
                                    {this.state.shops.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="agentId">Agent</Label>
                                <Input
                                    type="select"
                                    name="agentId"
                                    value={this.state.bill.agentId}
                                    onChange={this.onFormFieldUpdate}>
                                    {this.state.agents.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="amount">Amount</Label>
                                <Input
                                    type="number"
                                    name="amount"
                                    min={0}
                                    value={this.state.bill.amount}
                                    onChange={this.onFormFieldUpdate}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="dueOn">Due On</Label>
                                <Input
                                    type="date"
                                    name="dueOn"
                                    value={this.state.bill.dueOn}
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
                            {this.state.bill.id ? 'Update' : 'Add'}
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

AddEditBillModal.propTypes = {
    isOpen: PropTypes.bool,
    className: PropTypes.string,
    modalCloseCallback: PropTypes.func,
    bill: PropTypes.shape({
        agentId: PropTypes.number | PropTypes.string,
        shopId: PropTypes.number | PropTypes.string,
        amount: PropTypes.number | PropTypes.string,
        createdOn: PropTypes.string,
        dueOn: PropTypes.string
    })
};

export default AddEditBillModal;
