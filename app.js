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

// Installed
let Express = load("#express");
let Hogan = load("#hogan-cached");

let Cors = require("cors");
let Cookies = load("#cookie-parser");
let BodyParser = load("#body-parser");

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
app.set("hogan cache", false); // Remove before production
app.set("hogan options", {delimiters: "{?-- --?}"});
app.set("view engine", "html");
app.set("views", Path.resolve(__dirname + "/out"));

app.use(Cors());
app.use(BodyParser.json());
app.use(Cookies());

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
    res.redirect("http://192.168.1.34:2000/404");
});

Database.connect({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "demolay"
}).then((err) => {
    if(err) {
        console.log(err.code);
        process.exit(-1);
    } else {
        app.listen(2000, "192.168.1.34");
    }
});
//module.exports = app;
