/**
 *	Packman - Resource Compiler
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

import { Global, Constants } from "../global"
import { FileSystemHelper } from "./filesystem.helper";
import { Terminal } from "./terminal";

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

/**
 *	Enable Sourcemaps like this:
 *	.pipe(sourcemaps.init())
 *	.pipe(taskSass().on('error', this.processorTaskError))
 *	.pipe(sourcemaps.write())
*/

class ResourceProcessor {
	fileSystemHelper: FileSystemHelper;
	terminal: Terminal;
	
	constructor() {
		this.fileSystemHelper = new FileSystemHelper();
		this.terminal = new Terminal();
	}
	
	/************************************************************
	 * 
	 * 
	 *                      SCRIPTS
	 * 
	 * 
	 ***********************************************************/
	public compileScriptBundle(destPath: string, bundleFilename: string,
		filesInBundle: string[], onCompileDone) {

		var stream = gulp.src(filesInBundle)
			.pipe(taskUglify())
			.pipe(taskConcat(bundleFilename))
			.pipe(gulp.dest(destPath));
		
		stream.on('end', function() {
			onCompileDone();
			console.log("STREAN END");
		});
	}

	/************************************************************
	 * 
	 * 
	 *                       STYLES
	 * 
	 * 
	 ***********************************************************/
	public compileStyles(destPath: string, bundleFilename: string,
		filesInBundle: string[], onCompileDone) {
		
		this.terminal.echoArray("StyleSheets", filesInBundle);
		this.terminal.echoInfo("Output Path Path \"" + destPath + "\"");

		var stream = gulp.src(filesInBundle)
			.pipe(taskSass().on('error', function(error) {
				console.log("SASS Compilation error", error.message);
			}))
			.pipe(taskMinify())
			.pipe(taskConcat(bundleFilename))
			.pipe(gulp.dest(destPath));
			
		stream.on('end', function() {
			onCompileDone();
			console.log("STREAN END");
		});
	}
}

export { ResourceProcessor }