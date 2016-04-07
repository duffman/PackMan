/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 * 
 *	IMPORTANT NOTE: 2016-04-07
 *	Set the "hard" root directory via command line parameter,
 *	if not set all paths will be relative to app root. 
 */

/// <reference path="typings/main.d.ts" />

"use strict";

import { Global, ResourceType } from "./global";
import { FileSystemHelper } from "./core/filesystem.helper";
import { ResourceConfiguration } from "./core/resource.configuration";
import { ResourceProcessor } from "./core/resource.processor";
import { Terminal } from "./core/terminal";
import { StringBuffer } from "./utilities/string-buffer"
var StringHelper	= require('./utilities/string.helper').StringHelper;
var ArrayHelper		= require('./utilities/array.helper').ArrayHelper;

var walker      	= require('walk');
var fs          	= require('fs');
var path        	= require('path') ;
var jsonfile    	= require('jsonfile');

// Tasks
var gulp			= require('gulp');
var taskConcat		= require('gulp-concat');
var taskReplace		= require('gulp-replace');
var taskRename		= require('gulp-rename');
var taskSass		= require('gulp-sass');
var taskUglify		= require('gulp-uglify');
var taskMinify		= require('gulp-minify-css');
var taskSourceMaps  = require('gulp-sourcemaps');
var taskScsslint	= require('gulp-scss-lint');

const DEFAULT_CONFIG_FILENAME = "cms.config.json";

class PackmanApp {
	public resourceRootDirectory: string = null;
	public mainConfigurationFile = "";

	resourceConfiguration: ResourceConfiguration;
	fileSystemHelper: FileSystemHelper;
	terminal: Terminal;
	
	constructor() {
		this.resourceConfiguration = new ResourceConfiguration();
		this.fileSystemHelper = new FileSystemHelper();
		this.terminal = new Terminal();
	}

	getResourceTypeFromString(resourceName: string) {
		var resourceType = ResourceType.Unknown;

		switch (resourceName.toLowerCase()) {
			case Global.RESOURCE_NAME_STYLESHEET:
				resourceType = ResourceType.Style
				break;
			case Global.RESOURCE_NAME_SCRIPT:
				resourceType = ResourceType.Script
				break;
		}
		
		return resourceType;
	}

	validateConfigValues(configData: any): boolean {
		return true;
	}

	useAbsolutePathForPart(part) {
		return part.absolutePath != undefined && part.absolutePath;
	}

	/**
	 * Quick and dirty parsing of command line parameters...
	 */
	parseConfigurationFileParameter() {
		var parameters = process.argv.slice(2);
		var resourceRootParam = null;
		
		if (parameters.length > 0 && !StringHelper.isNullOrEmpty(parameters[0])) {
			resourceRootParam = parameters[0];
			if (!this.fileSystemHelper.fileOrDirectoryExists(resourceRootParam)) {
				this.terminal.echoPurple("Resource Root diectory \"" + resourceRootParam + "\" does not exist, aborting!");
				process.exit(1);
			}
		}
		
		return resourceRootParam;
	}
	
	getConfigurationFilename() {
		
	}

	/**
	 * Application Entry point
	 */
	public execute() {
		var terminal = this.terminal;
		var configurationFileName = this.getConfigurationFilename();
		
		
		
		var configFileParam = this.parseConfigurationFileParameter();
		this.resourceRootDirectory = configFileParam;

		if (StringHelper.isNullOrEmpty(resourceRootParam)) {
			this.resourceRootDirectory = path.dirname(require.main.filename);
			
			var infoText = new StringBuffer()
				.append("No root directory provided, using apllication root: ")
				.append(this.resourceRootDirectory, true); 
			
			terminal.echoWarning(infoText.toString())
		}
		
		  //"resource.main.config.json";

		this.mainConfigurationFile = path.join(this.resourceRootDirectory, configurationFileName);
		this.terminal.echoSetting("Configuration filename:", this.mainConfigurationFile);

		if (!this.fileSystemHelper.fileOrDirectoryExists(this.mainConfigurationFile)) {
			this.terminal.echoScreamingError("Configuration file \"" + this.mainConfigurationFile + "\" not found, aborting!");
			process.exit(1);
		}

		var configuration = this.parseConfigurationFile(this.mainConfigurationFile);
	}

	/**
	 * Read and verify the main configuration file, kick off the build process
	 */
	parseConfigurationFile(configurationFileName: string) {
		var self = this;
		var terminal = this.terminal;
		var configurationData: any;

		// Read the main resource configuration file from disk.
		configurationData = jsonfile.readFileSync(configurationFileName);
		
		if (this.resourceConfiguration.validateConfiguration()) {
			this.parseResourceSections(configurationData.sections);
		}
	}
	
	parseResourceSections(resourceSections: any) {
		var self = this;
		resourceSections.forEach(function(section) {
			var sectionBundles = section.bundles;
			var resourceType = self.getResourceTypeFromString(section.type);
			self.terminal.echoStatus("Section type:", section.type);
			self.parseSectionBundles(self.resourceRootDirectory, sectionBundles, resourceType);
		});
	}
	
	getBundleRootDirectory(bundle: any): string {
		var haveBundleRoot = !StringHelper.isNullOrEmpty(bundle.root);
		var bundleRootDirectory = haveBundleRoot ? path.join(this.resourceRootDirectory, bundle.root)
			: this.resourceRootDirectory;
		
		
		var bp = new Array<string>();
		bp.push("this.resourceRootDirectory: " + this.resourceRootDirectory);
		bp.push("bundle.root: " + bundle.root);
		this.terminal.echoArray("Paths Info", bp);
		
		return bundleRootDirectory;
	}

	getFullBundlePartFilename(bundle: any) : string {
		var terminal = this.terminal;
		
		var bundleRoot = this.getBundleRootDirectory(bundle.root);
		
		/*
		terminal.echoStatus("Bundle Root", bundleRoot);
		terminal.echoStatus("Bundle Name", bundle.name);
		terminal.echoStatus("Bundle Output Filename", bundleFilename);	
		*/
		
		return "";	
	}

	parseSectionBundles(rootDir, bundles, resourceType) {
		var self = this;
		var terminal = this.terminal;

		var bundleCount = bundles.length;
		var bundleCountSuffix = bundleCount != 1 ? "bundles" : "bundle";
		
		terminal.echo(bundleCount + " " + bundleCountSuffix + " found in section");

		for (var i = 0; i < bundleCount; i++) {
			var bundle = bundles[i];
			var bundleRoot = this.getBundleRootDirectory(bundle);
			
			terminal.echoInfo("Parsing bundle, using root: " + bundleRoot);
			
			var bundlePath = bundle.bundlePath;
			var bundleFilename = bundle.bundleFilename;

			var filesInBundle = [];
			var preservedPartsOrder = [];

			// Extracts filenames... 
			self.parseBundleParts(bundleRoot, bundle.parts, filesInBundle, preservedPartsOrder);

			/**
			 *	2016-04-07 
			 *	FIX: Added an extra stage in the bundling process to enable bundling of
			 *	assets generated in the same scope..
			 * 
			 *	TODO: Add cleanup functionality to remove compiled resources when
			 *	the final bundling is done...
			 *
			 */
			switch (resourceType) {
				case ResourceType.Script:
					self.compileScripts(bundleFilename, bundlePath, filesInBundle);
					//self.bundleScripts(bundleFilename, bundlePath, filesInBundle);
					break;

				case ResourceType.Style:
					//self.bundleStyles(bundleFilename, bundlePath, filesInBundle);
					break;
				
			}
		}
	}
	
	parseBundleParts(bundleRoot: string, bundleParts: any,
		filesInBundle: string[], preservedPartsOrder: string[]) {

		console.log("Parse Bundle Parts (bundleRoot)", bundleRoot);
		
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
				self.terminal.echoScreamingError("\"" + partSource + "\" is missing, terminating...");
				process.exit(1);
			}
		});		
	}
	
	/************************************************************
	 * 
	 * 
	 *				   PROCESS AND BUILD ASSETS
	 * 
	 * 
	 ***********************************************************/
	compileScriptBundle(targetFilename: string, bundleOutputPath: string, filesInBundle: string[]) {
		
	}

	/**
	 * 
	 */
	compileScripts(bundleFilename, bundlePath, filesInBundle) {
	
	}

	/**
	 * 
	 */
	bundleScripts(bundleFilename, bundlePath, filesInBundle) {
		this.terminal.echoStatus("Compiling Scripts bundle to:", bundleFilename);
		gulp.src(filesInBundle)
			.pipe(taskSourceMaps.init())
			.pipe(taskConcat(bundleFilename))
			//.pipe(taskUglify())
			.pipe(taskSourceMaps.write())
			.pipe(gulp.dest(bundlePath));
			
		/*
	.pipe(sourcemaps.init())
	.pipe(taskSass().on('error', this.processorTaskError))
	.pipe(sourcemaps.write())
		*/
	}
	
	/* Source map generation
	.pipe(sourcemaps.init())
	.pipe(taskSass().on('error', this.processorTaskError))
	.pipe(sourcemaps.write())
	*/

	bundleStyles(bundleFilename, bundlePath, filesInBundle) {
		this.terminal.echoStatus("Compiling Styles bundle to:", bundleFilename);
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
}

var packman = new PackmanApp();
packman.execute();
