// Routing for "/dl"

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const Media = require('../models/Media');

router.get('/', (req, res) => {
    Media.getFromDb();

    let vid = new Media(req.query.url);
    vid.title = req.query.title;
    vid.artist = req.query.artist;
    vid.album = req.query.album;
    vid.startAt = req.query.startAt;
    vid.endAt = req.query.endAt;
    vid.format = 'mp3';

    let ip;
    if (process.env.PROXY_HEADER_REAL_IP_KEY) {
        ip = req.get(process.env.PROXY_HEADER_REAL_IP_KEY);
    } else {
        ip = req.connection.remoteAddress;
    }

    console.info(new Date().toISOString(), '[IP:' + ip + ']', '-',
        'start downloading', vid.title, 'from', vid.url);

    let str = vid.saveToCache();
    console.info(str);

    res.attachment(vid.title + '.mp3');
});

module.exports = router;
