import gulp from 'gulp';
import server from 'browser-sync';

require('require-dir')('./tasks');



gulp.task('images', gulp.series('cleanImgs', gulp.parallel('imgs', 'symbols', 'sprite')), done => {
	server.reload();
	done();
});

gulp.task('build', gulp.series('clean', 'sprite', 'symbols', gulp.parallel('imgs', 'favicons', 'fonts', 'html', 'scss', 'scripts')));

gulp.task('prod', gulp.series('clean', 'sprite', 'symbols', gulp.parallel('imgs', 'favicons', 'fonts', 'html', 'scss', 'scripts', 'gzip')));





