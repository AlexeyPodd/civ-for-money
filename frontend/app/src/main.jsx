import React from 'react';
import ReactDOM from 'react-dom/client'
import CivForMoneyApp from './App.jsx'
import store from './redux/store.js';


window.store = store;

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <CivForMoneyApp />
  // </React.StrictMode>,
)
