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

// Local
let Database = load("app.managers.Database");

// Routers
let BlogRouter = load("app.routers.api.BlogRouter");

// Variables
let app = new Express();

global.config = JSON.parse(FS.readFileSync(__dirname + "/config.json"));

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
Database.connect(global.config.database).then((err) => {
    if(err) {
        console.log(err.code);
        process.exit(-1);
    } else if(global.config.local) {
        app.listen(2000, "192.168.1.37");
    }
});

module.exports = app;
