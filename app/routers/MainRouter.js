"use strict";

let Router = load("app.routers.Router");

class MainRouter extends Router {

    constructor() {
        super();
        this.router.hogan("/", "index", {});
    }

}

module.exports = MainRouter;
