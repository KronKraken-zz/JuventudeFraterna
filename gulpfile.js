let Gulp = require("gulp");
let Path = require("path");

let paths = {
    html: {
        in: Path.resolve(__dirname + "/src/*.html"),
        out: Path.resolve(__dirname + "/out/")
    },

    elements: Path.resolve(__dirname + "/assets/elements/*.html")
};

// General
let Cached = require("gulp-cached");
let Remember = require("gulp-remember");
let Changed = require("gulp-changed");

// HTML
let Vulcanize = require("gulp-vulcanize");
let HTMLMin = require("gulp-htmlmin");

Gulp.task("html", () => {
    return Gulp.src(paths.html.in)
        //.pipe(Changed(paths.html.out))
        //.pipe(Cached("html"))
        .pipe(Vulcanize({
            inlineCss: true,
            inlineScripts: true,
            stripComments: true
        }))
        .on("error", (err) => (console.log(err.stack)))
        .pipe(HTMLMin({
            minifyCSS: true,
            minifyJS: true,
            collapseWhitespace: true
        }))
        //.pipe(Remember("html"))
        .pipe(Gulp.dest(paths.html.out));
});

Gulp.task("watch", () => {
    Gulp.watch([paths.html.in, paths.elements], ["html"]);
});
