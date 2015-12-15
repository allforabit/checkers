import css from './style.scss'
import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import Validator from 'redux-validator'

import io from 'socket.io-client'

import {setState} from './actions'

import remoteActionMiddleware from './remote-action-middleware'

import App from './App'
import checkersApp from './reducers'

const socket = io()

const validator = Validator()

const finalCreateStore = compose(
  // Enables your middleware
  applyMiddleware(
    validator,
    remoteActionMiddleware(socket)
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const store = finalCreateStore(checkersApp)

socket.on('state', state => {
  store.dispatch(setState(state))
})

const rootElement = document.getElementById('root')

render(
  <div>
    <Provider store={store}>
      <App />
    </Provider>
  </div>,
  rootElement
)
