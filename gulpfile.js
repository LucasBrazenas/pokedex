const { src, dest, watch, parallel } = require("gulp");

// CSS

const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");

// Imagenes

const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const cache = require("gulp-cache");
const avif = require("gulp-avif");

function css(done) {
    src('src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(dest("build/css"));

    done();
}

function imageminConvert(done) {
    const options = {
        optimizationLevel: 3
    };

    src('src/img/**/*.{png,jpg}')
    .pipe(cache(imagemin(options)))
    .pipe(dest('build/img'));

    done();
}

function convertToWebp(done) {
    const options = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
    .pipe(webp(options))
    .pipe(dest('build/img'));

    done();
}

function convertToAvif(done) {
    const options = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
    .pipe(avif(options))
    .pipe(dest('build/img'));

    done();
}

function javascript(done) {
    src('src/js/**/*.js')
    .pipe(dest('build/js'));

    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);

    done();
}

exports.css = css;
exports.imageminConvert = imageminConvert;
exports.convertToWebp = convertToWebp;
exports.convertToAvif = convertToAvif;
exports.images = parallel(imageminConvert, convertToWebp, convertToAvif);
exports.javascript = javascript;
exports.dev = dev;