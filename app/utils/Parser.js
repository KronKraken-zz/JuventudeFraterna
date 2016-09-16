"use strict";
let HTMLParser = load("#htmlparser2").Parser;

class Parser {

    static parse(body) {
        let $ = [];
        let all = [];
        let cur = null;
        let id = 0;
        let parser = new HTMLParser({
            onopentag: (name, attr) => {
                let elem = {
                    name: name,
                    id: id,
                    attr: attr,
                    parent: null,
                    children: [],
                    content: ""
                };

                if(cur != null) {
                    elem.parent = cur;
                    cur.children.push(elem);
                }

                cur = elem;
                id++;
            },

            ontext: (text) => {
                if(cur != null) {
                    cur.content += text;
                }
            },

            onclosetag: (name) => {
                all.push(cur);

                if(cur.parent != null) {
                    cur = cur.parent;
                } else {
                    $.push(cur);
                    cur = null;
                }
            }
        }, {decodeEntities: true, lowerCaseTags: true, lowerCaseAttributeNames: true});
        parser.write(body);
        parser.end();

        $.getByID = (id) => {
            let found = null;
            all.forEach((elem) => {
                if(elem.attr.hasOwnProperty("id") && elem.attr.id == id) {
                    found = elem;
                }
            });

            return found;
        };

        $.getAll = () => {
            return all;
        };

        return $;
    }

}

module.exports = Parser;
