/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

// Tasks
var gulp			= require('gulp');
var taskConcat		= require('gulp-concat');
var taskReplace		= require('gulp-replace');
var taskRename		= require('gulp-rename');
var taskSass		= require('gulp-sass');
var taskUglify		= require('gulp-uglify');
var taskMinify		= require('gulp-minify-css');
var plumber			= require('gulp-plumber');
var taskSourceMaps  = require('gulp-sourcemaps');
var taskScsslint	= require('gulp-scss-lint');

class ResourceProcessor {
	constructor() {
	}	
}

export { ResourceProcessor }