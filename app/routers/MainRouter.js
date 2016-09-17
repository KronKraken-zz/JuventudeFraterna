"use strict";

let Router = load("app.routers.Router");

class MainRouter extends Router {

    constructor() {
        super();
        this.router.hogan("/", "index");
        this.router.hogan("/post/:id", "post", {id: "$param(id)"});
        this.router.hogan("/404", "error", {error: "Página não encontrada."});
    }

}

module.exports = MainRouter;
