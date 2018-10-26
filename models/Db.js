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
    allMedia: 'SELECT * FROM media;',
    startTransaction: 'START TRANSACTION;',
    commit: 'COMMIT;',
    rollback: 'ROLLBACK;'
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

const pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
    waitForConnections: dbWaitConnection,
    connectionLimit: dbConnectionLimit,
    queueLimit: dbQueueLimit
});

class Db {
    static async buildSchema() {
        var conn = await pool.getConnection();
        await conn.beginTransaction();
        await conn.query(queries.dropMedia);
        await conn.query(queries.createMedia);
        await conn.release();
        console.info('Schema built successful');
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
