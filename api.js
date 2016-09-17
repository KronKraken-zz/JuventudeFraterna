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

let Cors = require("cors");
let Cookies = load("#cookie-parser");
let BodyParser = load("#body-parser");

// Local
let Database = load("app.managers.Database");

// Routers
let BlogRouter = load("app.routers.api.BlogRouter");

// Variables
let app = new Express();

app.use(Cors());
app.use(BodyParser.json());
app.use(Cookies());

app.use((req, res, next) => {
    res.error = (msg) => {
        if(typeof msg != "string") {msg = msg.toString();}
        res.json({error: msg});
    };

    res.success = (obj) => {
        res.json({success: obj});
    };

    next();
});

new BlogRouter().register(app);

app.use("*", (req, res) => {
    res.error("Page not found.");
});

// Express paths
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
        app.listen(2001, "192.168.1.34");
    }
});
//module.exports = app;
