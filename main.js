const ytdl = require('ytdl-core');
const util = require('util');
const ffmpeg = require('fluent-ffmpeg');

function durationCal(startAt, endAt) {
    // calculate duration from start and end time
    // format:  mm:ss[.xxx]
    // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    return (+startAt.split(':')[0]) * 60 + (+startAt.split(':')[1]) - (+endAt.split(':')[0]) * 60 + (+endAt.split(':')[1]);
}

function output(data) {
    let output = ffmpeg(ytdl(data.url, {
            quality: 'highestaudio'
        }))
        .audioBitrate(128)
        .format('mp3')
        .seekInput(data.startAt)
        .on('error', (err) => console.error(err))
        .withOutputOption('-metadata', util.format('title=%s', data.title))
        .withOutputOption('-metadata',
            util.format('publisher=%s', 'Downloaded from YouTube using https://github.com/david-kroell/ytdl'))
        .withOutputOption('-metadata',
            util.format('artist=%s', data.artist || ''))
        .withOutputOption('-metadata',
            util.format('album=%s', data.album || ''));
    if (!isNaN(durationCal(data.startAt, data.endAt))) {
        output.duration(durationCal(data.startAt, data.endAt));
    }
    return output;
}

module.exports = {
    output
};
