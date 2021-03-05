import React from 'react';
import ReactDOM from 'react-dom';

import './utils/axios'

import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

//把整个app渲染到html id 为 root
ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
