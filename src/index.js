import css from './style.scss'
import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import promise from 'redux-promise'
import Validator from 'redux-validator'
import io from 'socket.io-client'

import {outClientViaSocketIO, inClientViaSocketIO} from 'redux-via-socket.io'

const socket = io() // socket.io client initialization

import App from './App'
import checkersApp from './reducers'

const validator = Validator()

const finalCreateStore = compose(
  // Enables your middleware:
  applyMiddleware(validator, promise, outClientViaSocketIO(socket)), // any Redux middleware, e.g. redux-thunk
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);


const store = finalCreateStore(checkersApp)

inClientViaSocketIO(socket, store.dispatch)

const rootElement = document.getElementById('root')

render(
  <div>
    <Provider store={store}>
      <App />
    </Provider>
  </div>,
  rootElement
)
