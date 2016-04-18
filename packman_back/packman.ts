/**
 *	Packman - Web Resource Manager
 *	@author Patrik Forsberg
 *	@date 2016
 * 
 *	IMPORTANT NOTE: 2016-04-07
 *	Set the "hard" root directory via command line parameter,
 *	if not set all paths will be relative to app root. 
 */

/// <reference path="typings/main.d.ts" />

"use strict";

import { Global, Types }				from "./global";
import { CommandLineProcessor }			from "./core/commandline.processor";
import { ConfigurationHandler }			from "./core/configuration/configuration.handler";
import { FileSystemHelper }				from "./core/filesystem.helper";
import { ConfigurationProcessor }		from "./core/configuration/configuration.processor"
import { MasterConfigurationProcessor } from "./core/master-configuration.processor";
import { ResourceConfiguration }		from "./core/resource.configuration";
import { ResourceProcessor }			from "./core/resource.processor";
import { Terminal }						from "./core/terminal";
import { StringBuffer }					from "./utilities/string-buffer"

var StringHelper	= require('./utilities/string.helper').StringHelper;
var ArrayHelper		= require('./utilities/array.helper').ArrayHelper;
var fs          	= require('fs');
var path        	= require('path') ;
var jsonfile    	= require('jsonfile');

class PackmanApp {
	public applicationRoot: string = path.dirname(require.main.filename);
	public resourceRootDirectory: string = null;

	public masterConfigurationFileName = "";
	public mainConfigurationFileName = "";

	configurationHandler: ConfigurationHandler;
	configurationProcessor: ConfigurationProcessor;
	masterConfigurationProcessor: MasterConfigurationProcessor;
	resourceConfiguration: ResourceConfiguration;
	resourceProcessor: ResourceProcessor;
	fileSystemHelper: FileSystemHelper;
	terminal: Terminal;
	
	constructor() {
		this.configurationHandler = new ConfigurationHandler(this.applicationRoot);
		this.configurationProcessor = new ConfigurationProcessor();
		this.masterConfigurationProcessor = new MasterConfigurationProcessor();
		this.resourceConfiguration = new ResourceConfiguration();
		this.resourceProcessor = new ResourceProcessor();
		this.fileSystemHelper = new FileSystemHelper();
		this.terminal = new Terminal();
	}
	
	public execute() {
		var terminal = this.terminal;

		var commandLineProcessor = new CommandLineProcessor();
		var options = commandLineProcessor.parseOptions();

		var masterConfigFilename = options.master != null ? options.master : Global.Settings.masterConfigFilename;
		this.masterConfigurationFileName = this.configurationHandler.decideOnConfigurationFilename(masterConfigFilename);
		terminal.echoPrefixedCyan("Using master configuration", this.masterConfigurationFileName);
		this.masterConfigurationProcessor.parseConfiguration(this.masterConfigurationFileName);
	
		if (options.section != null) {
			var sourceFilename = this.masterConfigurationProcessor.getSourceForName(options.section);
			this.executeSingleBuild(sourceFilename);
		} else {
			this.executeAllBuilds();
		}
	}


	/**
	 * Read and verify the main configuration file, kick off the build process
	 */
	parseConfigurationFile(configurationFileName: string): any {
		var self = this;
		var terminal = this.terminal;
		var configurationData = this.configurationProcessor.getConfigurationData(configurationFileName);
			
		if (configurationData != null
			&& this.resourceConfiguration.validateConfiguration(configurationData)) {
			
			// Set main Resource Path
			// -----------------------
			// All paths, (except bundle parts with an "absolutePath" flag set to true")
			// will be relative to this path.
			//
			// The resource path is compiled as follows:
			// 1. Config file path, either set by command line param or the Application Roo
			// 2. "root" option at root level in the configuration file.
			
			var configurationFilePath = path.dirname(configurationFileName);
			var rootPathInCongigurationFile = configurationData.root;
			this.resourceRootDirectory = path.join(configurationFilePath, rootPathInCongigurationFile);
		}
		
		return configurationData;
	}

	getBundleRootDirectory(bundle: any): string {
		var haveBundleRoot = !StringHelper.isNullOrEmpty(bundle.root);

		var bundleRootDirectory = haveBundleRoot ? path.join(this.resourceRootDirectory, bundle.root)
			: this.resourceRootDirectory;
		
		
		if (Global.Settings.verbose) {
			this.terminal.echoArray("Build Paths", [
				"ResourceRootDirectory: " + this.resourceRootDirectory,
				"Bundle Root: " + bundle.root,
			]);
		}
				
		return bundleRootDirectory;
	}

	/************************************************************
	 * 
	 * 
	 *				   APPLICATION ENTRY POINT
	 * 
	 * 
	 ***********************************************************/
	/*public execute() {
		var terminal = this.terminal;
		this.mainConfigurationFileName = this.decideOnConfigurationFilename(Global.Settings.defaultConfigFilename);
		var configurationData = this.parseConfigurationFile(this.mainConfigurationFileName);
				
		if (configurationData != null) {
			this.executeBuild(configurationData.sections);
		}
		else {
			// If we reach this point, the "validateConfiguration" will have provided
			// information about configuration errors, so simply terminate
			process.exit(1);
		}
	}
	*/
	
	executeSingleBuild(configFilename: string) {
		var terminal = this.terminal;

		console.log("executeSingleBuild", configFilename);

		//this.mainConfigurationFileName = this.decideOnConfigurationFilename(Global.Settings.defaultConfigFilename);
		var configurationData = this.parseConfigurationFile(configFilename);
				
		if (configurationData != null) {
			this.executeBuild(configurationData.sections);
		}
		else {
			// If we reach this point, the "validateConfiguration" will have provided
			// information about configuration errors, so simply terminate
			process.exit(1);
		}
	}
	
	executeAllBuilds() {
		var sources = this.masterConfigurationProcessor.configurations;

		for (var i = 0; i < sources.length; i++) {
			var source = sources[i];
			this.executeSingleBuild(source.src);
		}
	}

	executeBuild(resourceSections: any) {
		var self = this;

		resourceSections.forEach(function(section) {
			var debugInfo = new Array<string>();
			var sectionBundles = section.bundles;
			
			if (Global.Settings.debug) {
				debugInfo.push("Section name: " + section.name);
				debugInfo.push("Section type: " + section.type);
				
				if (Global.Settings.verbose) {
					self.terminal.echoArray("Parsing and compiling section", debugInfo);
				}
			}

			var resourceType = self.resourceConfiguration.getResourceTypeFromString(section.type);
			self.compileSectionBundles(self.resourceRootDirectory, sectionBundles, resourceType);
		});
	}

	compileSectionBundles(rootDir, bundles, resourceType) {
		var self = this;
		var terminal = this.terminal;
		var bundleCount = bundles.length;

		for (var i = 0; i < bundleCount; i++) {
			var bundle = bundles[i];
			var bundleRoot = this.getBundleRootDirectory(bundle); // NOT USED FOR BUNDLING OUTPUT
			var destPath = path.join(this.resourceRootDirectory, bundle.bundlePath);
			var bundleFilename = bundle.bundleFilename;
			var filesInBundle = [];
			var preservedPartsOrder = [];
			
			terminal.echoInfo("Parsing bundle, using root: " + bundleRoot);
			self.parseBundleParts(bundleRoot, bundle.parts, filesInBundle, preservedPartsOrder);

			switch (resourceType) {
				case Types.ResourceType.Script:
					this.resourceProcessor.compileScriptBundle(destPath, bundleFilename, filesInBundle, function() {
						//console.log("Script Compile Done");
					});
					break;

				case Types.ResourceType.Style:
					this.resourceProcessor.compileStyles(destPath, bundleFilename, filesInBundle, function() {
						//console.log("Style Compile Done");
					});
					break;
			}
		}
	}
	
	useAbsolutePathForPart(part) {
		return part.absolutePath != undefined && part.absolutePath;
	}
	
	parseBundleParts(bundleRoot: string, bundleParts: any,
		filesInBundle: string[], preservedPartsOrder: string[]) {
		this.terminal.echoInfo(`Parsing bundle parts "${bundleRoot}"`);
		
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
					self.terminal.echoInfo("Listing Directory: " + partSource);
					files = self.fileSystemHelper.getFilesInDirectory(partSource);
				} else if (stats.isFile()) {
					files = [partSource];
				}
				
				self.resourceConfiguration.filterExcludedFiles(files, []);
				ArrayHelper.arrayMerge(filesInBundle, files);
			} else {
				self.terminal.echoScreamingError(`Source "${partSource}" is missing.`);
				if (Global.Settings.terminateOnError && Global.Settings.allowMissingFiles == false) {
					self.terminal.echoScreamingError("Terminating...");
					process.exit(1);
				}
			}
		});		
	}
}

var packman = new PackmanApp();
packman.execute();