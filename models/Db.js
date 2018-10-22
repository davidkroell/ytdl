const mysql = require('mysql');

var dbHost = process.env.DB_HOST;
var dbDatabase = process.env.DB_DATABASE;
var dbUser = process.env.DB_USERNAME;
var dbPassword = process.env.DB_PASSWORD;
var buildSchema = process.env.DB_UPDATE_SCHEMA;

const publicQueries = {
    allvideos: 'SELECT * FROM videos;'
};

const queries = {
    dropVideos: 'DROP TABLE IF EXISTS videos;',
    createVideos: `CREATE TABLE videos
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

class Db {
    static getConnection() {
        let connection = mysql.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            database: dbDatabase
        });

        connection.connect();

        return connection;
    }

    static buildSchema() {
        let conn = this.getConnection();

        conn.beginTransaction(() => {
            conn.query(queries.dropVideos, (err) => {
                if (err){
                    throw err;
                }
                conn.query(queries.createVideos, (err) => {
                    if (err){
                        throw err;
                    }

                    conn.commit(() => {
                        if (err) {
                            conn.rollback(function() {
                              throw err;
                            });
                          }
                          console.log('Schema built successfully');
                    });
                });
            });
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
