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
	public compileScripts(outputPath: string, filesInBundle: string[]) {
		this.terminal.echoArray("Compiling Scripts", filesInBundle);
		this.terminal.echoInfo("Output Path Path \"" + outputPath + "\"");
		
		for (var i = 0; i < filesInBundle.length; i++) {
			var filename = filesInBundle[i];
			if (!this.fileSystemHelper.fileExists(filename)) {
				this.terminal.echoScreamingError("Script file \""
					+ this.fileSystemHelper.extractFilename(filename) + "\" not found!");
				if (Global.Settings.terminateOnError) process.exit(1);
			}
			
			this.terminal.echoPrefixedCyan("Compiling Script: ", filename);
			this.compileScriptsTask(outputPath, filesInBundle);
		}
	}	
	
	public compileScriptsTask(destPath: string, filesInBundle: string[]) {
		gulp.src(filesInBundle)
			.pipe(taskUglify())
			.pipe(gulp.dest(destPath));
	}

	//.pipe(taskUglify())
	public bundleScripts(bundleFilename, bundlePath, filesInBundle) {
		this.terminal.echoStatus("Creating Script Bundle:", bundleFilename);
		gulp.src(filesInBundle)
			.pipe(taskSourceMaps.init())
			.pipe(taskConcat(bundleFilename))
			.pipe(taskSourceMaps.write())
			.pipe(gulp.dest(bundlePath));
	}
	
	/************************************************************
	 * 
	 * 
	 *                       STYLES
	 * 
	 * 
	 ***********************************************************/
	public compileStyles(outputPath: string, filesInBundle: string[]) {
		this.terminal.echoArray("StyleSheets", filesInBundle);
		this.terminal.echoInfo("Output Path Path \"" + outputPath + "\"");
		
		for (var i = 0; i < filesInBundle.length; i++) {
			var filename = filesInBundle[i];
			if (!this.fileSystemHelper.fileExists(filename)) {
				this.terminal.echoScreamingError("StyleSheet \""
					+ this.fileSystemHelper.extractFilename(filename) + "\" not found!");
				if (Global.Settings.terminateOnError) process.exit(1);
			}
			
			this.terminal.echoPrefixedMagenta("Compiling StyleSheet: ", filename);
			var compilationResult = this.compileStylesTask(outputPath, filesInBundle);
		}
	}		 

	public compileStylesTask(destPath: string, filesInBundle: string[]) {
		return gulp.src(filesInBundle)
			.pipe(taskSass().on('error', function(error) {
				console.log("SASS Compilation error", error.message);
			}))
			.pipe(taskMinify())
			.pipe(gulp.dest(destPath));
	}
}

export { ResourceProcessor }