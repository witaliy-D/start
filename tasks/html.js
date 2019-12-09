import gulp from 'gulp';
import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import panini from 'panini';
import replace from 'gulp-replace';
import server from 'browser-sync';
import yargs from 'yargs';

const argv = yargs.argv;
const production = !!argv.production;

gulp.task('html', () => {
	panini.refresh();
	return gulp.src('src/*.html')
		.pipe(plumber())
		.pipe(panini({
			root: 'src/',
			layouts: 'src/tpl/layouts/',
			partials: 'src/tpl/partials/',
			helpers: 'src/tpl/helpers/',
			data: 'src/tpl/data/'
		}))
		.pipe(gulpif(production, replace('.css', '.min.css')))
		.pipe(gulpif(production, replace('.js', '.min.js')))
		.pipe(gulp.dest('dist'))
		.pipe(server.stream());
});
