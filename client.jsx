'use strict'

//css
require('./style.scss');

var Reflux = require('reflux');

var Game = require('./game');

var Actions = require('./actions');

var Ctx = require('./ctx');

var Bootstrap = Ctx.bootstrap(Game);

React.render(<Bootstrap />, document.getElementById('content'))
