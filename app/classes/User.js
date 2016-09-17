"use strict";

let Request = load("#request");
let Parser = load("app.utils.Parser");
let Database = load("app.managers.Database");
let Crypto = load("#crypto");

if(global.user_cache == null) {
    global.user_cache = {};
}

class User {

    static login(id, password) {
        let encrypted_password = Crypto.createHash("sha256").update(password).digest("hex");
        return new Promise((pRes, pRej) => {
            Database.query("SELECT * FROM users WHERE id=? AND password=?;", [id, encrypted_password]).then((users) => {
                if(users == null) {
                    Request.post("https://sis.demolaybrasil.org.br/incs/login.php", {headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: "login=" + id + "&senha=" + password}, (err, res, body) => {
                        if(err || !body || body.indexOf("estatus") == -1) {
                            pRej("Um erro ocorreu ao tentar se conectar com o SISDM. Por favor, tente novamente mais tarde.");
                        } else if(body.indexOf("ok") == -1) {
                            pRej("Usuário ou senha inválido.");
                        } else {
                            if(res.headers && res.headers.hasOwnProperty("set-cookie")) {
                                let cookie = res.headers["set-cookie"][0];
                                cookie = cookie.replace("PHPSESSID=", "").replace("; path=/", "");
                                Request.get("https://sis.demolaybrasil.org.br/", {headers: {"Cookie": "PHPSESSID=" + cookie}}, (err, res, body) => {
                                    if(err || !body) {
                                        pRej();
                                    } else {
                                        let $ = Parser.parse(body);
                                        let name = $[0].children[1].children[0].children[8].children[1].children[1].children[0].content;
                                        let pic = "https://sis.demolaybrasil.org.br/" + $[0].children[1].children[0].children[4].children[0].attr.src;
                                        let user = new User({name: name, id: id, pic: pic, login_date: new Date(), permission: 0});
                                        Database.query("INSERT INTO users VALUES (?,?,?,?,?)", [id, name, 0, encrypted_password, pic]);
                                        pRes(user);
                                    }
                                });
                            } else {
                                pRej("Um erro ocorreu ao tentar se conectar com o SISDM. Por favor, tente novamente mais tarde.");
                            }
                        }
                    });
                } else {
                    let user = users[0];
                    pRes(new User({name: user.name, id: user.id, pic: user.picture, login_date: new Date()}));
                }
            }).catch(pRej);
        });
    }

    static getByID(id) {
        return new Promise((pRes, pRej) => {
            if(global.user_cache[id] != null) {
                pRes(global.user_cache[id]);
            } else {
                Database.query("SELECT * FROM users WHERE id=?", [id]).then((data) => {
                    if(data == null) {
                        pRes(null);
                    } else {
                        let user = data[0];
                        let u = new User({name: user.name, id: user.id, pic: user.pic, login_date: new Date(), permission: 0});
                        pRes(u);
                        global.user_cache[id] = u;
                    }
                }).catch(pRej);
            }
        });
    }

    constructor(data) {
        this._data = data;
    }

    getLoginDate() {
        return this._data.login_date;
    }

    getID() {
        return this._data.id;
    }

    getFirstName() {
        return this._data.name.split(" ")[0];
    }

    getName() {
        return this._data.name;
    }

    getPicture() {
        return this._data.pic;
    }

    getPermission() {
        return this._data.permission;
    }

}

module.exports = User;
