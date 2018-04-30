const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const express = require('express');

var app = express();
var port = process.env.PORT || 3000;


var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/html'));

app.get('/', function (req, res) {
    res.send('index.html');
});

app.post('/start-dl', function (req, res) {
    var dlUrl = req.body.url;
    var filename = req.body.filename;
    var startAt = req.body.startAt;
    var endAt = req.body.endAt;

    // calculate duration from start and end time
    // format:  mm:ss[.xxx]
    var convertionHelper = startAt.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var startSeconds = (+convertionHelper[0]) * 60 + (+convertionHelper[1]);

    // format:  mm:ss[.xxx]
    convertionHelper = endAt.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var endSeconds = (+convertionHelper[0]) * 60 + (+convertionHelper[1]);
    
    var duration = endSeconds - startSeconds;

    console.log(new Date().toISOString()," - ", "start downloading", filename, "from", dlUrl);

    let stream = ytdl(dlUrl, {
        quality: 'highestaudio'
    });

    res.attachment(filename + ".mp3");

    if(isNaN(duration))
        ffmpeg(stream)
            .audioBitrate(128)
            .format('mp3')
            .seekInput(startAt)
            // .duration(duration)
            .on('error', (err) => console.error(err))
            .pipe(res, { end: true });

    else
        ffmpeg(stream)
            .audioBitrate(128)
            .format('mp3')
            .seekInput(startAt)
            .duration(duration)
            .on('error', (err) => console.error(err))
            .pipe(res, { end: true });
});

app.listen(port);

app.on('listening', () => {
    debug('Listening on port ' + port)
})