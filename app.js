"use strict";

// Node Natives
let Path = require("path");

// Installed
let Express = require("express");
let Hogan = require("hogan-cached");

// Variables
let app = new Express();

// Express Config
app.engine("hogan", Hogan);
app.set("hogan options", {delimiters: "{?-- --?}"});
app.set("view engine", "hogan");
app.set("views", Path.resolve("/views"));


// Express paths
app.get("/", (req, res) => {
    res.render("index");
});

app.listen(80);
//module.exports = app;
