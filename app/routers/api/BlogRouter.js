"use strict";

let Router = load("app.routers.Router");
let Post = load("app.classes.Post");
let Database = load("app.managers.Database");

class MainRouter extends Router {

    constructor() {
        super("/blog");

        this.router.get("/posts", (req, res) => {
            Database.query("SELECT COUNT(*) FROM posts", []).then((data) => {
                res.success(data[0]["COUNT(*)"]);
            }).catch(res.error);
        });

        this.router.get("/posts/:from", (req, res) => {
            let f = Number(req.params.from);
            Post.getNextFive(f).then((posts) => {
                let ps = [];

                let check = () => {
                    if(ps.length >= posts.length) {
                        res.success({posts: ps});
                    }
                };

                posts.forEach((post) => {
                    post.getAuthor().then((user) => {
                        ps.push({id: post.getID(), title: post.getTitle(), description: post.getDescription(), image: post.getImage(), author: {name: user.getName(), permission: user.getPermission()}, date: post.getDate().getTime()});
                        check();
                    }).catch(res.error);
                });
            }).catch(res.error);
        });
    }

}

module.exports = MainRouter;
