"use strict";

let MySQL = load("#mysql");

class Database {

    static connect(options) {
        return new Promise((end) => {
            global.db_conn = MySQL.createConnection(options);
            global.db_conn.connect(end);
            Database.conn = global.db_conn;
        });
    }

    static query(sql, args) {
        return new Promise((pRes, pRej) => {
            if(Database.conn != null) {
                let a = Database.conn.query(sql, args, (err, res) => {
                    if(err || !res) {
                        pRej("Ocorreu um erro ao entrar em contato com a database. Código: " + err.code);
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

module.exports = Database;
