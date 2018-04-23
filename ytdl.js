const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const express = require('express');

var app = express();
var port = process.env.PORT || 3000;


var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded());

//var url = 'https://www.youtube.com/watch?v=Hrph2EW9VjY'

app.use(express.static(__dirname + '/html'));

app.get('/', function (req, res) {
    res.send('index.html');
});

app.post('/start-dl', function (req, res) {
    var dlUrl = req.body.url;
    var filename = req.body.filename;
    var startAt = req.body.startAt;
    var endAt = req.body.startAt;

    let stream = ytdl(dlUrl, {
        quality: 'highestaudio'
    });

    res.attachment(filename + ".mp3");

    ffmpeg(stream)
        .audioBitrate(128)
        .format('mp3')
        .seekInput(startAt)
        .seekOutput(endAt)
        .on('error', (err) => console.error(err))
        .pipe(res, { end: true });
});

app.listen(port);

app.on('listening', () => {
    debug('Listening on port ' + port)
})