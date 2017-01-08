/**
 * Gulp Task Runner Configuration
 */
var gulp = require('gulp'),
    path = require('path'),
    ts = require('gulp-typescript');
   

var typescriptFiles = ['./lib/**/**.ts','./index.ts'];


var tsConfig =  {"target" : "ES5", "module" : "commonjs"};
gulp.task('typescript', function () {
    return gulp.src(typescriptFiles)
        .pipe(ts(tsConfig))
        .pipe(gulp.dest(function(f) {
            return f.base
        }));

});



//Gulp build task
gulp.task('build',['typescript']);



//Watch typescript server files

gulp.task('watch', ['typescript'], function() {
    gulp.watch(typescriptFiles,function(file){
         return gulp.src(file.path)
             .pipe(ts(tsConfig))
             .pipe(gulp.dest(path.dirname(file.path)));
    });

})