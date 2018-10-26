const mysql = require('mysql2/promise');

var dbHost = process.env.DB_HOST;
var dbDatabase = process.env.DB_DATABASE;
var dbUser = process.env.DB_USERNAME;
var dbPassword = process.env.DB_PASSWORD;
var buildSchema = process.env.DB_UPDATE_SCHEMA;
var dbWaitConnection = process.env.DB_WAIT_FOR_CONNECTIONS;
var dbConnectionLimit = process.env.DB_CONNECTION_LIMIT;
var dbQueueLimit = process.env.DB_QUEUE_LIMIT;

const publicQueries = {
    allMedia: 'SELECT * FROM media;'
};

const queries = {
    dropMedia: 'DROP TABLE IF EXISTS media;',
    createMedia: `CREATE TABLE media
    (
      id       int PRIMARY KEY AUTO_INCREMENT,
      title    varchar(50),
      artist   varchar(50),
      album    varchar(50),
      format   varchar(10),
      start_at char(9),
      end_at   char(9),
      bitrate  int
    )`
};

const connPool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

class Db {
    static buildSchema() {
        connPool.query('SELECT 1+1 as result')
            .then((result) => {
                console.log(result);
                }).catch((err) => {
                console.log(err); // any of connection time or query time errors from above
                });
    }

    static init(){
        if (buildSchema) {
            this.buildSchema();
        }
    }
}

Db.init();

Db.queries = publicQueries;
module.exports = Db;
