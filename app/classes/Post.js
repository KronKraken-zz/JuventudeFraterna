"use strict";

let User = load("app.classes.User");
let Database = load("app.managers.Database");

class Post {

    static getByID(i) {
        return new Promise((pRes, pRej) => {
            Database.query("SELECT * FROM dm_posts WHERE id=?", [i]).then((data) => {
                if(data == null) {
                    pRes(null);
                } else {
                    pRes(new Post(data[0]));
                }
            }).catch(pRej);
        });
    }

    static getFromTo(a, b) {
        return new Promise((pRes, pRej) => {
            Database.query("SELECT * FROM dm_posts WHERE id>=? AND id<=?", [a, b]).then((data) => {
                if(data == null) {
                    pRes(null);
                } else {
                    let posts = [];
                    data.forEach((post_data) => {
                        posts.push(new Post(post_data));
                    });
                    pRes(posts);
                }
            }).catch(pRej);
        });
    }

    static getNextFive(i) {
        return Post.getFromTo(i, i + 5);
    }

    constructor(data) {
        this._data = data;
    }

    getID() {
        return this._data.id;
    }

    getTitle() {
        return this._data.title;
    }

    getDescription() {
        return this._data.description;
    }

    getContent() {
        return this._data.content;
    }

    getAuthor() {
        return new Promise((pRes, pRej) => {
            if(this.author == null) {
                User.getByID(this._data.author).then((user) => {
                    this.author = user;
                    pRes(user);
                }).catch(pRej);
            } else {
                pRes(this.author);
            }
        });
    }

    getDate() {
        return new Date(Number(this._data.date));
    }

}

module.exports = Post;
