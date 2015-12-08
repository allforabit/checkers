import 'babel-core/polyfill';

import React from 'react';
import { Provider } from 'react-redux';

import {configureStore} from './store';
import {App} from './containers.js';

const initialState = window.__INITIAL_STATE__;
console.log(initialState);

const store = configureStore(initialState);

const rootElement = document.getElementById('app');

React.render(
  <Provider store={store}>
    {() => <App/>}
  </Provider>,
  rootElement
);
