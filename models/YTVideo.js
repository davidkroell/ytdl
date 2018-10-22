const mysql = require('mysql');
const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const util = require('util');

var dbHost = process.env.DB_HOST;
var dbDatabase = process.env.DB_DATABASE;
var dbUser = process.env.DB_USERNAME;
var dbPassword = process.env.DB_PASSWORD;
var tmpPath = process.env.CACHE_DIR;

var queries = {
    test: 'SELECT 1 + 1 AS solution;'
};

class YTVideo {
    /**
     * @param {string} url
     */
    constructor(url) {
        this.videoId = ytdl.getVideoID(url);
    }

    static getFromDb() {
        let connection = this._connectDb();

        connection.query(queries.test, (error, results, fields) => {
            if (error) {
                throw error;
            }

            console.log('The solution is: ', results[0].solution);
            console.log('The fields are: ', fields);
        });

        connection.end();
    }

    saveToCache() {
        this._calcTimes(this);

        console.log(this);

        let path = tmpPath + '/' + this.videoId + '.' + this.format;
        let stream = this.getDownloadStream();

        stream.pipe(fs.createWriteStream(path));
        return path;
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
        let convertionHelper = this.startAt.split(':'); // split it at the colons
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        let startSeconds = (+convertionHelper[0]) * 60 + (+convertionHelper[1]);

        // format:  mm:ss[.xxx]
        convertionHelper = this.endAt.split(':'); // split it at the colons
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        let endSeconds = (+convertionHelper[0]) * 60 + (+convertionHelper[1]);

        this.duration = endSeconds - startSeconds;
    }

    _connectDb() {
        let connection = mysql.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            database: dbDatabase
        });

        connection.connect();

        return connection;
    }
}

YTVideo.prototype.videoId = '';
YTVideo.prototype.title = '';
YTVideo.prototype.artist = '';
YTVideo.prototype.startAt = '00:00.000';
YTVideo.prototype.endAt = '';
YTVideo.prototype.format = '';
YTVideo.prototype.duration = '';
YTVideo.prototype.audioBitrate = 128;
YTVideo.prototype.publisherStr = 'Downloaded from YouTube using https://github.com/david-kroell/ytdl';

module.exports = YTVideo;
