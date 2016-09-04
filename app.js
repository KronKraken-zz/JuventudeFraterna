"use strict";

// Node Natives
let Path = require("path");

// Installed
let Express = require("express");
let Hogan = require("hogan-cached");

// Variables
let app = new Express();

// Express Config
app.engine("html", Hogan);
app.set("hogan cache", false); // Remove before production
app.set("hogan options", {delimiters: "{?-- --?}"});
app.set("view engine", "html");
app.set("views", Path.resolve(__dirname + "/src"));


// Express paths
app.use("/assets", Express.static(Path.resolve(__dirname + "/bower_components")));
app.use("/assets", Express.static(Path.resolve(__dirname + "/assets")));

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(80);
//module.exports = app;
