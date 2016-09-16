"use strict";

let Express = load("#express");
let ExpressRouter = Express.Router;

class Router {

    constructor(path) {
        this.path = path;
        this.router = new ExpressRouter();

        this.router.hogan = (path, page, vars) => {
            if(vars == null) {vars = {};}
            this.router.get(path, (req, res) => {
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
