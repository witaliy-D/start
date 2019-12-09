import gulp from 'gulp';
import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import include from 'gulp-include';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import debug from 'gulp-debug';
import yargs from 'yargs';
import server from 'browser-sync';

const argv = yargs.argv;
const production = !!argv.production;

gulp.task('scripts', () => {
	return gulp.src('src/js/*.js')
		.pipe(plumber())
		.pipe(gulpif(!production, sourcemaps.init()))
		.pipe(include())
		.pipe(babel())
		.pipe(gulpif(!production, sourcemaps.write('.')))
		.pipe(gulpif(production, terser()))
		.pipe(gulpif(production, rename({suffix: '.min'})))
		.pipe(gulp.dest('dist/js'))
		.pipe(debug({title: 'JS '}))
		.pipe(server.stream());
});
