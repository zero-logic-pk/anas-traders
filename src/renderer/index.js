import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Route, Link } from 'react-router-dom';
// import history from 'his';

import ShopManagement from '../app/ShopManagement.js';
import AgentManagement from '../app/AgentManagement.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import BillManagement from '../app/BillManagement.js';

function App() {
    return (
        <React.Fragment>
            <Router>
                <div>
                    <ul>
                        <li>
                            <Link to="/shops">Shops</Link>
                        </li>
                        <li>
                            <Link to="/agents">Agents</Link>
                        </li>
                        <li>
                            <Link to="/bills">Bills</Link>
                        </li>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                    </ul>
                    <hr />
                </div>
                <Route path="#shops" component={ShopManagement} />
                <Route path="#agents" component={AgentManagement} />
                <Route path="#bills" component={BillManagement} />
                <Route path="#" exact component={ShopManagement} />
                <Route path="/" exact component={ShopManagement} />
            </Router>
        </React.Fragment>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));

/*
                <Nav tabs>
                <NavItem>
                    <NavLink to="/" active>Home</NavLink>
                </NavItem>
                    <NavItem>
                        <Link to="/">Home</Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/shops">Shops</Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/agents">Agents</Link>
                    </NavItem>
                </Nav>

                <Navbar color="light" light expand="lg,md">
                    <NavbarBrand href="/" className="mr-auto">
                        Home
                    </NavbarBrand>
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <Link to="/shops">Shops</Link>
                            </NavItem>
                            <NavItem>
                                <Link to="/agents">Agents</Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
 */
