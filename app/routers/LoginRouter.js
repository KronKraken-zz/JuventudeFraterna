"use strict";

let Router = load("app.routers.Router");
let User = load("app.classes.User");
let Session = load("app.managers.Session");

class LoginRouter extends Router {

    constructor() {
        super("");

        this.router.post("/login", (req, res) => {
            if(req.body == null) {
                res.json({error: "Missing body."});
            } else {
                let id = req.body.id;
                let password = req.body.password;

                if(id == null || password == null) {
                    res.json({error: "Missing credentials."});
                } else {
                    let newUser = () => {
                        User.login(id, password).then(user => {
                            let id = Session.createSession(user);
                            res.json({id: id, user: {name: user.getName(), pic: user.getPicture()}});
                        }).catch(err => {
                            res.json({error: err});
                        });
                    };

                    let session_id = Session.getSessionByUser(id);
                    if(session_id != null) {
                        let user = Session.getSession(session_id);
                        let now = new Date();
                        let login_date = user.getLoginDate();

                        if(now.getTime() - login_date.getTime() < 4.32e+7) {
                            res.json({id: session_id, user: {name: user.getName(), pic: user.getPicture()}});
                        } else {
                            newUser();
                        }
                    } else {
                        newUser();
                    }
                }
            }
        });

        this.router.get("/logout", (req, res) => {
            if(req.user == null) {
                res.json({error: "Not logged in."});
            } else {
                let id = Session.getSessionByUser(req.user.getID());
                if(id != null) {
                    global.sessions.by_id[id] = null;
                    global.sessions.by_user[req.user.getID()] = null;
                    res.json({success: "Logged out."});
                } else {
                    res.json({error: "Not logged in."});
                }
            }
        });
    }

}

module.exports = LoginRouter;
