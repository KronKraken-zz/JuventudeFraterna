"use strict";

let MySQL = load("#mysql");

class Database {

    static connect(options) {
        return new Promise((end) => {
            global.db_conn = MySQL.createConnection(options);
            global.db_conn.connect();
            end();
        });
    }

    static query(sql, args) {
        return new Promise((pRes, pRej) => {
            if(Database.conn != null) {
                Database.conn.query(sql, args, (err, res) => {
                    if(err || !res) {
                        pRej(err.toString());
                    } else {
                        if(res.length == 0) {
                            pRes(null);
                        } else {
                            pRes(res);
                        }
                    }
                });
            } else {
                pRej("Falha ao se conectar com a database.");
            }
        });
    }

}

Database.conn = global.db_conn;

module.exports = Database;
