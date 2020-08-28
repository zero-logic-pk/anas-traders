import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import ShopManagement from '../app/ShopManagement.js';
import AgentManagement from '../app/AgentManagement.js';
import BillManagement from '../app/BillManagement.js';

import 'bootstrap/dist/css/bootstrap.min.css';

function renderSwitch(currentComponent) {
    switch (currentComponent) {
        case 'home':
            return <BillManagement />;

        case 'shops':
            return <ShopManagement />;

        case 'agents':
            return <AgentManagement />;

        default:
            return <BillManagement />;
    }
}

function App() {
    const [currentComponent, setCurrentComponent] = useState('home');

    return (
        <>
            <>
                <ul>
                    <li>
                        <a
                            href="javascript:void(0)"
                            onClick={() => setCurrentComponent('home')}>
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="javascript:void(0)"
                            onClick={() => setCurrentComponent('shops')}>
                            Shops
                        </a>
                    </li>
                    <li>
                        <a
                            href="javascript:void(0)"
                            onClick={() => setCurrentComponent('agents')}>
                            Agents
                        </a>
                    </li>
                </ul>
                {renderSwitch(currentComponent)}
                {/* {currentComponent === 'home' && <BillManagement />}
                {currentComponent === 'shops' && <ShopManagement />}
                {currentComponent === 'agents' && <AgentManagement />} */}
                {/* <ShopManagement path="/" />
                <ShopManagement path="shops" />
                <AgentManagement path="agents" />
                <BillManagement path="bills" /> */}
                {
                    // <>
                    // <div>
                    //     <ul>
                    //         <li>
                    //             <Link to="/shops">Shops</Link>
                    //         </li>
                    //         <li>
                    //             <Link to="/agents">Agents</Link>
                    //         </li>
                    //         <li>
                    //             <Link to="/bills">Bills</Link>
                    //         </li>
                    //         <li>
                    //             <Link to="/">Home</Link>
                    //         </li>
                    //     </ul>
                    //     <hr />
                    // </div>
                    //     <Route path="/shops" component={ShopManagement} />
                    //     <Route path="/agents" component={AgentManagement} />
                    //     <Route path="/bills" component={BillManagement} />
                    //     <Route path="/" exact component={ShopManagement} />
                    // </>
                }
            </>
        </>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
