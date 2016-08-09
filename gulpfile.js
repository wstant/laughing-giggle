'use strict'

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

var path = './dev/styles/**/*.scss';

gulp.task('watch', function(){
	gulp.watch(path, ['styles']);
});

gulp.task('styles', function(){
	return gulp.src(path)
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/styles'))
});

