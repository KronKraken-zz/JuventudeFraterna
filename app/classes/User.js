"use strict";

let Request = load("#request");
let Parser = load("app.utils.Parser");
class User {

    static login(id, password) {
        //IMPORTANT:0 Replace login system to use SISDM only upon first login and store information in Database.
        return new Promise((pRes, pRej) => {
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
                                let user = new User({name: name, id: id, pic_url: pic, session: cookie, session_date: new Date()});
                                pRes(user);
                            }
                        });
                    } else {
                        pRej("Um erro ocorreu ao tentar se conectar com o SISDM. Por favor, tente novamente mais tarde.");
                    }
                }
            });
        });
    }

    constructor(data) {
        this._data = data;
    }

    getAuth() {
        return this._data.session;
    }

    getLoginDate() {
        return this._data.session_date;
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
        return this._data.pic_url;
    }

}

module.exports = User;
