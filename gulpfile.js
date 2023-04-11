import gulp from "gulp"
import bs from "browser-sync"
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
const sass = gulpSass(dartSass)

const path = {
	build: {
		css: `public/css/`
	},
	src: {
		scss: `scss/style.scss`
	},
	watch: {
		ejs: `views/**/*.ejs`,
		js: `public/**/*.js`,
		scss: `scss/**/*.scss`,
	}
}

function scss() {
	return gulp.src(path.src.scss, { sourcemaps: true })
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ["last 3 versions"],
			cascade: true
		}))
		.pipe(gulp.dest(path.build.css))
		.pipe(bs.stream())
}

const sync = () => {
	bs.init({
		proxy: 'http://localhost:3000/',
		notify: false,
		reloadDelay: 100,
	});
}
function ejs() {
	return gulp.src(path.watch.ejs)
		.pipe(bs.stream())
}
function js() {
	return gulp.src(path.watch.js)
		.pipe(bs.stream())
}

function watcher() {
	gulp.watch(path.watch.ejs, ejs)
	gulp.watch(path.watch.scss, scss)
	gulp.watch(path.watch.js, js)
}
const dev = gulp.series(scss, gulp.parallel(watcher, sync));

gulp.task('default', dev);