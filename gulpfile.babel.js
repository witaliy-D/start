import gulp from 'gulp';
import server from 'browser-sync';

require('require-dir')('./tasks');


gulp.task('images', gulp.series('cleanImgs', gulp.parallel('imgs', 'symbols', 'sprite', 'favicons')), done => {
	server.reload();
	done();
});

gulp.task('start', gulp.series('clean', 'sprite', 'symbols', gulp.parallel('imgs', 'favicons', 'fonts', 'html', 'scss', 'scripts'), 'serve'));

gulp.task('prod', gulp.series('clean', 'sprite', 'symbols', gulp.parallel('imgs', 'favicons', 'fonts', 'html', 'scss', 'scripts', 'gzip')));





