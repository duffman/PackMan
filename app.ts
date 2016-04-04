/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="typings/main.d.ts" />

"use strict";

import { Global } from "./global";
import { FileSystemHelper } from "./core/filesystem.helper";
import { ResourceProcessor } from "./core/resource-processor";
import { Terminal } from "./core/terminal";

var StringHelper	= require('./utilities/string.helper').StringHelper;
var ArrayHelper		= require('./utilities/array.helper').ArrayHelper;

var walker      	= require('walk');
var fs          	= require('fs');
var path        	= require('path') ;
var jsonfile    	= require('jsonfile');
var chalk       	= require('chalk');

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

class App {
	fileSystemHelper: FileSystemHelper;
	terminal: Terminal;
	
	constructor() {
		this.fileSystemHelper = new FileSystemHelper();
		this.terminal = new Terminal();
	}

	readOptions(jsonObj) {
		console.log("Reading options...");
	}

	getResourceTypeFromString(resourceName: string) {
		var resourceType = Global.ResourceType.Unknown;

		switch (resourceName.toLowerCase()) {
			case Global.RESOURCE_NAME_STYLESHEET:
				resourceType = Global.ResourceType.Style
				break;
			case Global.RESOURCE_NAME_SCRIPT:
				resourceType = Global.ResourceType.Script
				break;
		}
		
		return resourceType;
	}

	validateConfigValues(configData: any) {
	}

	useAbsolutePathForPart(part) {
		return part.absolutePath != undefined && part.absolutePath;
	}

	/**
	 * Read the asset build machibe configuration and
	 * execute tasks accordingly
	 */
	readConfig() {
		var extensionsRulesMask = "*.js, , *.html, *.css, *.exe";
		var extensionRules = extensionsRulesMask.split(",");
		
		extensionRules.forEach(function(rule) {
			rule = rule.trim();
		
			if (StringHelper.isNullOrEmpty(rule)) {
			}
			
			// Ignore all file extensions filter
			// at least 1 char is required for extension
			if (rule.startsWith("*.") && rule.length > 2) {
				// Extract the file extension
				//var fileExt
			} 
			
		});
		 
		var self = this;
		var errorLog = [];
		var terminal = this.terminal;
		
		var configData = jsonfile.readFileSync("main.config.json");
		var rootDir = configData.root;

		this.validateConfigValues(configData);

		configData.sections.forEach(function(section) {
			var sectionBundles = section.bundles;
			var resourceType = self.getResourceTypeFromString(section.type);
			console.log(
					chalk.blue("Section type"),
					chalk.green.bold(section.type)
			);
						
			self.parseSectionBundles(rootDir, sectionBundles, resourceType);
		});
	}
	
	parseSectionBundles(rootDir, bundles, resourceType) {
		var self = this;
		var terminal = this.terminal;

		var bundleCount = bundles.length;
		var bundleCountSuffix = bundleCount != 1 ? "bundles" : "bundle";
		console.log(chalk.green.bold(bundleCount + ' ' +  bundleCountSuffix + 'found, Packman is on the case!'));

		for (var i = 0; i < bundleCount; i++) {
			var bundle = bundles[i];
			var bundleRoot = bundle.root != undefined ? bundle.root : rootDir;
			var bundlePath = bundle.bundlePath;
			var bundleFilename = bundle.bundleFilename;

			if (StringHelper.isNullOrEmpty(bundleRoot)) {
				this.terminal.echoScreamingError('Output path for bundle "' + chalk.bold(bundle.name)
					+ '"bailing out! Run with ' + chalk.green.bold.underline('--force') + ' to ignore error.');
				continue;
			}

			if (StringHelper.isNullOrEmpty(bundleFilename)) {
				terminal.echoError("Bundle filename is missing!");
				continue;
			}

			terminal.echoWarning("Bundle Root", bundleRoot);
			terminal.echoWarning("Bundle Name", bundle.name);
			terminal.echoWarning("Bundle Filename", bundleFilename);

			this.readOptions(bundle);

			var filesInBundle = [];
			var preservedPartsOrder = [];

			self.parseBundleParts(bundleRoot, bundle.parts, filesInBundle, preservedPartsOrder);

			switch (resourceType) {
				case ResourceType.Script:
					self.bundleScripts(bundleFilename, bundlePath,filesInBundle);
					break;

				case ResourceType.Style:
					self.bundleStyles(bundleFilename, bundlePath, filesInBundle);
					break;
				
			}
		}
	}
	
	/************************************************************
	 * 
	 * 
	 * 				BUILD RESOURCES
	 * 
	 * 
	 ***********************************************************/
	bundleScripts(bundleFilename, bundlePath, filesInBundle) {
		console.log("BUNDLE SCRIPTS!!!", filesInBundle);
		gulp.src(filesInBundle)
			.pipe(taskConcat(bundleFilename))
			.pipe(taskUglify())
			.pipe(gulp.dest(bundlePath));
	}
	
	/* Source map generation
	.pipe(sourcemaps.init())
	.pipe(taskSass().on('error', this.processorTaskError))
	.pipe(sourcemaps.write())
	*/
	
	bundleStyles(bundleFilename, bundlePath, filesInBundle) {
		console.log("BUNDLE STYLES!!!");
		gulp.src(filesInBundle)
			.pipe(taskSass().on('error', function(error) {
				console.log("SASS ERROR", error.message);
			}))
			.pipe(taskConcat(bundleFilename))
			.pipe(taskMinify())
			.pipe(gulp.dest(bundlePath));
	}

	filterFiles(fileList: string[], ignoreList: string[]) {
		fileList.forEach(function(file) {
			//console.log("filterFiles", "EXT: " + path.extname(file) + " : " + file);
		});
	}
	
	parseBundleParts(bundleRoot: string, bundleParts: any,
		filesInBundle: string[], preservedPartsOrder: string[]) {
		
		var self = this;
		bundleParts.forEach(function(part) {
			var partSource = "";
			
			if (self.useAbsolutePathForPart(part)) {
				partSource = part.src;
			} else {
				partSource = path.join(bundleRoot, part.src);
			}

			if (fs.existsSync(partSource)) {
				preservedPartsOrder.push(partSource);
				var stats = fs.lstatSync(partSource);
				
				var files = [];
				
				if (stats.isDirectory()) {
					files = self.fileSystemHelper.getFilesInDirectory(partSource);
				} else if (stats.isFile()) {
					files = [partSource];
				}

				//* TODO: This should not be needed, ignored files should
				//* never be added in the first
				self.filterFiles(files, []);

				ArrayHelper.arrayMerge(filesInBundle, files);
			} else {
				self.terminal.echoMissingFileError(partSource);
			}
		});		
	}

	public execute() {
		this.readConfig();
	}
}

var core = new Core();
core.execute();
