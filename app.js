"use strict";

// Better looking require
global.path = require("path");
global.load = (p) => {
    let isGlobal = p.startsWith("#");
    if(isGlobal) {
        p = p.substring(1);
    } else {
        p = p.replace(/[.]/g, "/");
    }
    return require(isGlobal ? p : path.resolve(__dirname + "/" + p + ".js"));
};

// Node Natives
let Path = load("#path");
let FS = load("#fs");

// Installed
let Express = load("#express");
let Hogan = load("#hogan-cached");

// Local
let User = load("app.classes.User");
let Session = load("app.managers.Session");
let Database = load("app.managers.Database");

// Routers
let MainRouter = load("app.routers.MainRouter");
let LoginRouter = load("app.routers.LoginRouter");

// Variables
let app = new Express();

// Express Config
app.engine("html", Hogan);
app.set("hogan options", {delimiters: "{?-- --?}"});
app.set("view engine", "html");
app.set("views", Path.resolve(__dirname + "/out"));

// Sessions
app.use((req, res, next) => {
    let id = req.cookies.session;
    if(id != null) {
        let sess = Session.getSession(id);
        if(sess != null) {
            req.user = sess;
        } else {
            req.user = null;
        }
    } else {
        req.user = null;
    }

    next();
});

// Express paths
app.use("/assets", Express.static(Path.resolve(__dirname + "/assets")));

new LoginRouter().register(app);
new MainRouter().register(app);

app.use("*", (req, res) => {
    res.redirect("https://kronkraken.net/demolay/404");
});

Database.connect(JSON.parse(FS.readFileSync(__dirname + "/db.json"))).then((err) => {
    if(err) {
        console.log(err.code);
        process.exit(-1);
    }
});
module.exports = app;
