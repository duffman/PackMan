/**
 *	Packman - The Asset Machine
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
const DEBUG = true;

class PackmanApp {
	public applicationRoot: string = path.dirname(require.main.filename);
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

	useAbsolutePathForPart(part) {
		return part.absolutePath != undefined && part.absolutePath;
	}

	/**
	 *	Simple method for parsing the first command line parameter.
	 *	The function is prepared to handle any number of parameters
	 */
	parseConfigurationFileParameter(): string {
		var commandLineParams = process.argv.slice(2);
		var paramsNullOrEmpty = StringHelper.isNullOrEmpty(commandLineParams[0]);
		var containsParameterIndex = commandLineParams.length > 0;
		var configFileParameter = null;
		
		if (!paramsNullOrEmpty && containsParameterIndex) {
			configFileParameter = commandLineParams[0];
		}
				
		return configFileParameter;
	}
	
	/**
	 *	Gets the resource configuration filename with a fallbacks
	 *	in the following order.
	 *	1. Check if the CL parameter is a valid filename
	 *	2. Check if the CL is a valid directory and fall back on default filename
	 *  3. Fall back on the application directory and default filename
	 *	4. Fail!
	 *
	 *	TODO: Clean up
	 */
	decideOnConfigurationFilename(): string {
		var configFilename = path.join(this.applicationRoot, DEFAULT_CONFIG_FILENAME);
		var configFileParam = this.parseConfigurationFileParameter();
		var haveConfigFileParam = configFileParam != null;
		var configFileParamIsDirectory = haveConfigFileParam && this.fileSystemHelper.isDirectory(configFileParam);
		
		if (haveConfigFileParam && !this.fileSystemHelper.fileOrDirectoryExists(configFileParam)) {
			this.terminal.echoScreamingError("Invalid configuration filename: \""
				+ configFileParam + "\" terminating");
			process.exit(1);
		}
		
		if (this.fileSystemHelper.fileExists(configFileParam) && !configFileParamIsDirectory) {
			configFilename = configFileParam;
			if (DEBUG) this.terminal.echoWarning("Using provided configuration file parameter \""
				+ configFilename + "\"");
		}
		else if (haveConfigFileParam && configFileParamIsDirectory) {
			configFilename = path.join(configFileParam, DEFAULT_CONFIG_FILENAME);			
			if (DEBUG) this.terminal.echoInfo("Using path \"" + configFileParam
				+ "\" with defaut filename \"" + DEFAULT_CONFIG_FILENAME + "\"");
		}
		else {
			this.terminal.echoWarning("No filename or filepath provided, using default \""
				+ configFilename + "\"");
		} 

		return configFilename;
	}

	/**
	 * Read and verify the main configuration file, kick off the build process
	 */
	parseConfigurationFile(configurationFileName: string): any {
		var self = this;
		var terminal = this.terminal;
		var configurationData: any = null;

		// Read the main resource configuration file from disk.
		terminal.echoInfo("Reading configuration filename \"" + configurationFileName + "\"");

		var jsonData = jsonfile.readFileSync(configurationFileName);
		
		if (this.resourceConfiguration.validateConfiguration(jsonData)) {
			configurationData = jsonData;
			
			// Set main Resource Path
			// -----------------------
			// All paths, (except bundle parts with an "absolutePath" flag set to true")
			// will be relative to this path.
			//
			// The resource path is compiled as follows:
			// 1. Config file path, either set by command line param or the Application Roo
			// 2. "root" option at root level in the configuration file.
			
			var configurationFilePath = path.dirname(configurationFileName);
			var rootPathSetInCongigurationFile = configurationData.root;
			
			
			this.resourceRootDirectory = ;
		}
		
		return configurationData;
	}

	getBundleRootDirectory(bundle: any): string {
		console.log("GET BUNDLE ROOT DIRECTORY!!!!");
		
		var haveBundleRoot = !StringHelper.isNullOrEmpty(bundle.root);

		console.log("haveBundleRoot", haveBundleRoot);
		console.log("this.resourceRootDirectory", this.resourceRootDirectory);
		console.log("bundle.root", bundle.root);

		var bundleRootDirectory = haveBundleRoot ? path.join(this.resourceRootDirectory, bundle.root)
			: this.resourceRootDirectory;
		
		
		var bp = new Array<string>();
		bp.push("this.resourceRootDirectory: " + this.resourceRootDirectory);
		bp.push("bundle.root: " + bundle.root);
		this.terminal.echoArray("Paths Info", bp);
		
		return bundleRootDirectory;
	}

	/************************************************************
	 * 
	 * 
	 *				   APPLICATION ENTRY POINT
	 * 
	 * 
	 ***********************************************************/
	public execute() {
		var terminal = this.terminal;
		this.mainConfigurationFile = this.decideOnConfigurationFilename();
		var configurationData = this.parseConfigurationFile(this.mainConfigurationFile);
				
		if (configurationData != null) {
			
			console.log("resourceRootDirectory!!!!!", this.resourceRootDirectory);			
			
			this.executeBuild(configurationData.sections);
		}
		else {
			// If we reach this point, the "validateConfiguration" will have provided
			// information about configuration errors, so simply terminate
			process.exit(1);
		}
	}

	executeBuild(resourceSections: any) {
		var self = this;

		//TODO: Replace the "forEach" with a "for in""
		resourceSections.forEach(function(section) {
			var debugInfo = new Array<string>();
			var sectionBundles = section.bundles;

			debugInfo.push("Section name: " + section.name);
			debugInfo.push("Section type: " + section.type);
			
			if (DEBUG ) {
				self.terminal.echoArray("Parsing and compiling section", debugInfo);
			}

			var resourceType = self.resourceConfiguration.getResourceTypeFromString(section.type);
			self.compileSectionBundles(self.resourceRootDirectory, sectionBundles, resourceType);
		});
	}

	compileSectionBundles(rootDir, bundles, resourceType) {
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
				
				this.resourceConfiguration.filterExcludedFiles(files, []);
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
}

var packman = new PackmanApp();
packman.execute();
