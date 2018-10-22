const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const util = require('util');
const db = require('./Db');

var tmpPath = process.env.CACHE_DIR;

class Video {
    /**
     * @param {string} url
     */
    constructor(url) {
        this.videoId = ytdl.getVideoID(url);
    }

    static getFromDb() {
        let connection = db.getConnection();

        connection.query(db.queries.allvideos, (error, results) => {
            if (error) {
                throw error;
            }

            console.log('The solution is: ', results);
        });

        connection.end();
    }

    saveToCache() {
        this._calcTimes(this);

        console.log(this);

        let path = tmpPath + '/' + this.videoId + '.' + this.format;
        let stream = this.getDownloadStream();

        stream.pipe(fs.createWriteStream(path), {end: true});
        return path;
    }

    saveToDb() {
        // todo
    }

    getDownloadStream() {
        let stream = ytdl(this.videoId);

        let output = ffmpeg(stream)
            .audioBitrate(this.audioBitrate)
            .format(this.format)
            .seekInput(this.startAt)
            .on('error', (err) => console.error(err))
            .withOutputOption('-metadata', util.format('title=%s', this.title))
            .withOutputOption('-metadata',
                util.format('publisher=%s', this.publisherStr));

        if (!isNaN(this.duration)) {
            output.duration(this.duration);
        }
        if (this.artist) {
            output.withOutputOption('-metadata',
                util.format('artist=%s', this.artist));
        }
        if (this.album) {
            output.withOutputOption('-metadata',
                util.format('album=%s', this.album));
        }

        return stream;
    }

    _calcTimes() {
        // calculate duration from start and end time
        // format:  mm:ss[.xxx]
        // split it at the colons
        let convertionHelper = this.startAt.split(':');
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        let startSeconds = (+convertionHelper[0]) * 60 + (+convertionHelper[1]);

        // format:  mm:ss[.xxx]
        convertionHelper = this.endAt.split(':'); // split it at the colons
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        let endSeconds = (+convertionHelper[0]) * 60 + (+convertionHelper[1]);

        this.duration = endSeconds - startSeconds;
    }
}

Video.prototype.videoId = '';
Video.prototype.title = '';
Video.prototype.artist = '';
Video.prototype.startAt = '00:00.000';
Video.prototype.endAt = '';
Video.prototype.format = '';
Video.prototype.duration = '';
Video.prototype.audioBitrate = 128;
// eslint-disable-next-line max-len
Video.prototype.publisherStr = 'Downloaded from YouTube using https://github.com/david-kroell/ytdl';

module.exports = Video;
