'use strict';

const mongoose = require('mongoose');
const express = require('express');
const https = require('https');
const compression = require('compression');
const bodyParser = require('body-parser');
const passport = require('passport')
const session = require('express-session');
const db = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/bookswap';
mongoose.connect(db);
require('./models/book.js');
require('./models/user.js');
require('./twitter/twitter.js');
const routes = require('./routes/index.js');
const jwtSecret = process.env.JWTSECRET;

const app = express();
app.use(compression());

const port = process.env.PORT || 5000;

app.set('port', port);

app.use(express.static(process.cwd() + '/build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(session({ secret: jwtSecret, resave: true, saveUninitialized: true}));

app.use('/', routes);

app.listen(app.get('port'), function(){
	console.log('Server listening on port ' + port);
});