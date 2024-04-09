const { src, dest, watch } = require("gulp");
const minifyCss = require("gulp-clean-css");
const sourceMap = require("gulp-sourcemaps");
const minifyJs = require("gulp-uglify");
const concat = require("gulp-concat");

const bundleCss = () => {
    return src("./public/css/**/*.css")
        .pipe(sourceMap.init())
        .pipe(minifyCss())
        .pipe(concat("bundle.css"))
        .pipe(sourceMap.write())
        .pipe(dest("./dist/public/css"));
}

const bundleJs = () => {
    return src("./public/js/**/*.js")
        .pipe(sourceMap.init())
        .pipe(minifyJs())
        .pipe(concat("bundle.js"))
        .pipe(sourceMap.write())
        .pipe(dest("./dist/public/js"));
}

const devWatch = () => {
    watch("./public/css/**/*.css", bundleCss);
    watch("./public/js/**/*.js", bundleJs);
}

exports.bundleCss = bundleCss;
exports.bundleJs = bundleJs;
exports.devWatch = devWatch;
