#!/usr/bin/env node

// get environment variables
require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(logger('dev'));

app.use(express.static(__dirname + '/html'));

// Routers
const dlRouter = require('./routes/dlRouter');
app.use('/dl', dlRouter);

app.listen(port, () => {
    console.info('Listening on port', port);
});

// for testing purposes
module.exports = app;
