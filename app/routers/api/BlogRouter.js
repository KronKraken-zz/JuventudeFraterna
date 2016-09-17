"use strict";

let Router = load("app.routers.Router");
let Post = load("app.classes.Post");
let Database = load("app.managers.Database");

class MainRouter extends Router {

    constructor() {
        super("/blog");

        this.router.get("/posts", (req, res) => {
            Database.query("SELECT COUNT(*) FROM dm_posts", []).then((data) => {
                res.success(data[0]["COUNT(*)"]);
            }).catch(res.error);
        });

        this.router.get("/posts/:from", (req, res) => {
            let f = Number(req.params.from);
            Post.getNextFive(f).then((posts) => {
                let ps = [];

                let check = () => {
                    if(ps.length >= posts.length) {
                        res.success(ps);
                    }
                };

                posts.forEach((post) => {
                    post.getAuthor().then((user) => {
                        ps.push({id: post.getID(), title: post.getTitle(), description: post.getDescription(), author: user.getName(), date: post.getDate().getTime()});
                        check();
                    }).catch(res.error);
                });
            }).catch(res.error);
        });

        this.router.get("/post/:id", (req, res) => {
            let id = Number(req.params.id);
            Post.getByID(id).then((post) => {
                if(post == null) {
                    res.error("Página não encontrada.");
                } else {
                    post.getAuthor().then((user) => {
                        res.success({id: post.getID(), title: post.getTitle(), description: post.getDescription(), author: user.getName(), date: post.getDate().getTime(), content: post.getContent()});
                    }).catch(res.error);
                }
            }).catch(res.error);
        });
    }

}

module.exports = MainRouter;
