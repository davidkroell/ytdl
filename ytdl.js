#!/usr/bin/env node

const express = require('express');

var app = express();
var port = process.env.PORT || 3000;


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/html'));

app.get('/', function (req, res) {
    res.send('index.html');
});

app.get('/dl', function (req, res) {
    let dlUrl = req.query.url;
    let title = req.query.title;
    let ip = process.env.PROXY_HEADER_REAL_IP_KEY ? req.get(process.env.PROXY_HEADER_REAL_IP_KEY) : req.connection.remoteAddress;
    console.info(new Date().toISOString(), '[IP:' + ip + ']', '-',
        'start downloading', title, 'from', dlUrl);
    res.attachment(title + '.mp3');
    require('./main').output(req.query).pipe(res, {
        end: true
    });
});

app.listen(port, () => {
    console.info('Listening on port', port);
});

// for testing purposes
module.exports = app;
