/**
 *	Packman - Web Resource Manager
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
var taskRename		= require('gulp-rename');
var taskSass		= require('gulp-sass');
var taskUglify		= require('gulp-uglify');
var taskMinifyCss	= require('gulp-cssnano');
var taskSourceMaps  = require('gulp-sourcemaps');
var taskScsslint	= require('gulp-scss-lint');
var taskInsert		= require('gulp-insert');
var path			= require("path");

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
		var self = this;
		
		this.terminal.echoArray("Compiling Scripts", filesInBundle);
		this.terminal.echoInfo("Output Path Path \"" + destPath + "\"");

		var dateString = new Date().toString();
		var dnaStamp = "// PackMan DNA | " + dateString + "\n";

		var stream = gulp.src(filesInBundle)
			.pipe(taskSourceMaps.init())
			.pipe(taskUglify())
			.pipe(taskConcat(bundleFilename))
			.pipe(taskSourceMaps.write())
			.pipe(taskInsert.prepend(dnaStamp))
			.pipe(gulp.dest(destPath));
		
		stream.on('end', function() {
			onCompileDone();
			self.terminal.echoPrefixedMagenta("** Script Build done", path.join(destPath, bundleFilename));
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
		var self = this;

		this.terminal.echoArray("Compiling StyleSheets", filesInBundle);
		this.terminal.echoInfo("Output Path Path \"" + destPath + "\"");

		var dateString = new Date().toString();
		var dnaStamp = "/* PackMan DNA | " + dateString + "*/\n";

		var stream: any;
		if (Global.Settings.useSourceMaps) {
			var stream = gulp.src(filesInBundle)
				.pipe(taskSourceMaps.init())
				.pipe(taskSass().on('error', function(error) {
					console.log("SASS Compilation error", error.message);
				}))
				.pipe(taskMinifyCss())
				.pipe(taskConcat(bundleFilename))
				.pipe(taskSourceMaps.write())
				.pipe(taskInsert.prepend(dnaStamp))
				.pipe(gulp.dest(destPath));
		}
					
		stream.on('end', function() {
			onCompileDone();
			self.terminal.echoPrefixedCyan("** Style Build done", path.join(destPath, bundleFilename));
		});
	}
}

export { ResourceProcessor }