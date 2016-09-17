"use strict";

let Express = load("#express");
let ExpressRouter = Express.Router;

class Router {

    constructor(path) {
        this.path = path;
        this.router = new ExpressRouter();

        this.router.hogan = (path, page, vars) => {
            this.router.get(path, (req, res) => {
                if(vars == null) {
                    vars = {};
                } else {
                    Object.keys(vars).forEach((key) => {
                        let value = vars[key];
                        if(value == null || typeof value != "string") {return;}
                        if(value.startsWith("$param(")) {
                            let val = value.replace("$param(", "");
                            val = val.substring(0, val.length - 1);
                            vars[key] = req.params[val];
                        }
                    });
                }

                if(req.user != null) {
                    vars.user = {name: req.user.getName(), pic: req.user.getPicture()};
                } else {
                    vars.user = null;
                }
                res.render(page, vars);
            });
        };
    }

    register(app) {
        if(this.path == null) {
            app.use(this.router);
        } else {
            app.use(this.path, this.router);
        }
    }

}

module.exports = Router;
