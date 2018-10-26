const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const util = require('util');
const db = require('./Db');

var tmpPath = process.env.CACHE_DIR;

class Media {
    /**
     * @param {string} url
     */
    constructor(url) {
        this.MediaId = ytdl.getVideoID(url);
    }

    static getFromDb() {
        let connection = db.getConnection();

        connection.query(db.queries.allMedia, (error, results) => {
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

        let path = tmpPath + '/' + this.MediaId + '.' + this.format;
        let stream = this.getDownloadStream();

        stream.pipe(fs.createWriteStream(path), {end: true});
        return path;
    }

    saveToDb() {
        // todo
    }

    getDownloadStream() {
        let stream = ytdl(this.MediaId);

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

Media.prototype.MediaId = '';
Media.prototype.title = '';
Media.prototype.artist = '';
Media.prototype.startAt = '00:00.000';
Media.prototype.endAt = '';
Media.prototype.format = '';
Media.prototype.duration = '';
Media.prototype.audioBitrate = 128;
// eslint-disable-next-line max-len
Media.prototype.publisherStr = 'Downloaded from YouTube using https://github.com/david-kroell/ytdl';

module.exports = Media;
