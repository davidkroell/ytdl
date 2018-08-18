#!/usr/bin/env node
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const express = require('express');
const util = require('util');

var app = express();
var port = process.env.PORT || 3000;


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/html'));

app.get('/', function (req, res) {
    res.send('index.html');
});

app.post('/start-dl', function (req, res) {
    let dlUrl = req.body.url;

    let title = req.body.title;
    let artist = req.body.artist;
    let album = req.body.album;
    let publisherStr =
        'Downloaded from YouTube using https://github.com/david-kroell/ytdl';

    let startAt = req.body.startAt;
    let endAt = req.body.endAt;

    // calculate duration from start and end time
    // format:  mm:ss[.xxx]
    let convertionHelper = startAt.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    let startSeconds = (+convertionHelper[0]) * 60 + (+convertionHelper[1]);

    // format:  mm:ss[.xxx]
    convertionHelper = endAt.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    let endSeconds = (+convertionHelper[0]) * 60 + (+convertionHelper[1]);

    let duration = endSeconds - startSeconds;

    let ip = req.headers[process.env.PROXY_HEADER_REAL_IP_KEY] || req.connection.remoteAddress;
    console.info(new Date().toISOString(), '-', '[' + ip + ']',
        'start downloading', title, 'from', dlUrl);

    let stream = ytdl(dlUrl, {
        quality: 'highestaudio'
    });

    res.attachment(title + '.mp3');

    let output = ffmpeg(stream)
        .audioBitrate(128)
        .format('mp3')
        .seekInput(startAt)
        .on('error', (err) => console.error(err))
        .withOutputOption('-metadata', util.format('title=%s', title))
        .withOutputOption('-metadata',
        util.format('publisher=%s', publisherStr));

    if (!isNaN(duration)) {
        output.duration(duration);
    }
    if (artist) {
        output.withOutputOption('-metadata',
            util.format('artist=%s', artist));
    }
    if (album) {
        output.withOutputOption('-metadata',
            util.format('album=%s', album));
    }
    output.pipe(res, {end: true});
});

app.listen(port, () => {
    console.info('Listening on port', port);
});
