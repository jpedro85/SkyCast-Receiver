const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const minifyCss = require("gulp-clean-css");
const uglify = require('gulp-uglify');

// const SRC_DIR = 'public/js/**/*.js';
const SRC_DIR = [
    "public/js/enums/**/*.js",
    "public/js/media/**/*.js",
    "public/js/utils/**/*.js",
    "public/js/Main.js",
    "public/js/PlayerManager.js",
];
const DEST_DIR = 'public/dist';

gulp.task("minifyCss", () => {
    return gulp.src("./public/css/**/*.css")
        .pipe(concat("bundle.css"))
        .pipe(minifyCss())
        .pipe(gulp.dest(DEST_DIR))
})

gulp.task('scripts', () =>
    gulp.src(SRC_DIR)
        .pipe(babel({
            presets: ['@babel/env'],
            plugins: [['@babel/plugin-transform-runtime', {
                "corejs": false,
                "helpers": true,
                "regenerator": true,
                "useESModules": true
            }]]
        }))
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(DEST_DIR))
);

gulp.task('default', gulp.series("minifyCss"));
