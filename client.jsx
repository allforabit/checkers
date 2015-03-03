'use strict'

//css
require('./style.scss');

var Reflux = require('reflux');

var Board = require('./board');

var Actions = require('./actions');

var Ctx = require('./ctx');

var Bootstrap = Ctx.bootstrap(Board);

React.render(<Bootstrap />, document.getElementById('content'))
