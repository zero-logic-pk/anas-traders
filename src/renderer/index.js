import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import ShopManagement from '../app/ShopManagement.js';
import AgentManagement from '../app/AgentManagement.js';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div>
            <Router>
                <div>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/shops">Shops</Link>
                        </li>
                        <li>
                            <Link to="/agents">Agents</Link>
                        </li>
                    </ul>
                    <hr />

                    <Switch>
                        <Route path="/shops">
                            <ShopManagement />
                        </Route>
                        <Route path="/agents">
                            <AgentManagement />
                        </Route>
                        <Route path="/">
                            <ShopManagement />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
