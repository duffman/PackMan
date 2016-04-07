/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

var path = require("path");
var jsonfile = require("jsonfile");

import { Global } from "../global";
import { FileSystemHelper } from "./filesystem.helper";
import { Terminal } from "./terminal";
import { MiscHelper } from "../utilities/misc.helper";

class ResourceConfiguration {
	configurationFilename = null;
	fileSystemHelper: FileSystemHelper;
	terminal: Terminal;

	constructor() {
		var defaultConfigFilename = this.defaultConfigFilename();
		this.terminal = new Terminal();
	}
		
	defaultConfigFilename(): string {
		var configurationFilename = path.join(__dirname, Global.CONFIG_FILE);
		return configurationFilename;
	}

	printMissingOptionsMessage() {
		this.terminal.echoScreamingError("Configuration file Error, Options section missing!");
	}
	
	public parseExcludeList() {
		/*
		var extensionsRulesMask = "*.js, , *.html, *.css, *.exe";
		var extensionRules = extensionsRulesMask.split(",");
		
		for (var rule in extensionRules) {
			rule = rule.trim();
		
			if (StringHelper.isNullOrEmpty(rule)) {
				continue;
			}
			
			// Ignore all file extensions filter
			// at least 1 char is required for extension
			if (rule.startsWith("*.") && rule.length > 2) {
			} 
		}
		*/
		
	}
	
	/**
	 * TODO: It´s pretty obvious what needs to be don here...
	 */
	public validateConfiguration(filename?: string) {
		return true;
		/*
		if (MiscHelper.isNullOrEmpty(filename)) {
			this.configurationFilename = this.defaultConfigFilename();
			this.terminal.echoInfo("Using default configuration filename: " +  this.configurationFilename);
		}

		if (!this.fileSystemHelper.fileExists(this.configurationFilename)) {
			if (Global.Debug) {
				this.terminal.echoDebug('Configuration File "' + this.configurationFilename + '" is missing');
			}

			var exitMessage = `Default configuration file does not exist, bailing out!`;
			this.terminal.echoScreamingError(exitMessage);
			process.exit();
		}

		this.init();
		*/
	}
	
	public init() {
		if (Global.Debug) {
			this.terminal.echoDebug("Initializing resource configuration using: " +  this.configurationFilename);
		}
		
		var configJson = jsonfile.readFileSync(this.configurationFilename);

		if (configJson == undefined || configJson.options == undefined) {
			this.printMissingOptionsMessage();			
			return;
		}

		var optionsConfigJson = configJson.options;

		// Adapter assignment, not optimal but a bit too noisy
		// TODO: Serialize properties directly (Json -> Obj.Property)
		/*
		this.rootSettings.rootPath = optionsConfigJson.rootPath;
		this.rootSettings.followSymLinks = optionsConfigJson.followSymLinks;
		this.rootSettings.verbose = optionsConfigJson.verbose;
		this.rootSettings = optionsConfigJson.minify;
		this.rootSettings = optionsConfigJson.recursive;
		this.rootSettings = optionsConfigJson.lintFeedback;
		this.rootSettings = optionsConfigJson.useGitIgnore;
		this.rootSettings = optionsConfigJson.exclude;

		console.log("rootPath", optionsConfigJson.rootPath);
		console.log("followSymLinks", optionsConfigJson.followSymLinks);
		console.log("verbose", optionsConfigJson.verbose);
		console.log("minify", optionsConfigJson.minify);
		console.log("recursive", optionsConfigJson.recursive);
		console.log("lintFeedback", optionsConfigJson.lintFeedback);
		console.log("useGitIgnore", optionsConfigJson.useGitIgnore);
		console.log("exclude", optionsConfigJson.exclude);
		*/
	}
}

export { ResourceConfiguration }