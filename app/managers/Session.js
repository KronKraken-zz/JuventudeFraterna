"use strict";

let Crypto = load("#crypto");

if(global.sessions == null) {
    global.sessions = {
        by_id: {},
        by_user: {}
    };
}

class Session {

    static getSession(id) {
        return Session.sessions.by_id[id];
    }

    static getSessionByUser(u_id) {
        return Session.sessions.by_user[u_id];
    }

    static createSession(user) {
        if(Session.getSessionByUser(user.getID()) != null) {
            Session.session.by_id[Session.session.by_user[user.getID()].id] = null;
            Session.session.by_user[user.getID()] = null;
        }

        let now = new Date();
        let id = Crypto.createHash("sha256").update(user.getID() + "-" + now.toUTCString() + "-" + now.getMilliseconds()).digest("hex");
        Session.sessions.by_id[id] = user;
        Session.sessions.by_user[user.getID()] = id;
        return id;
    }

}

Session.sessions = global.sessions;

module.exports = Session;
