import gulp from 'gulp';
//import server from 'browser-sync';

require('require-dir')('./tasks');


//gulp.task('images', gulp.series('cleanImgs', gulp.parallel('imgs', 'symbols', 'sprite', 'favicons')), done => {
//server.reload();
//done();
//});

gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('fonts', 'sprite', 'symbols', 'favicons'),
	gulp.parallel('imgs', 'html', 'scss', 'scripts'),
	'serve'
));


gulp.task('prod', gulp.series(
	'clean',
	gulp.parallel('fonts', 'sprite', 'symbols', 'favicons'),
	gulp.parallel('imgs', 'html', 'scss', 'scripts', 'gzip')
));





