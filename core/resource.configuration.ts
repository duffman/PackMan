/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

var path = require("path");
var jsonfile = require("jsonfile");

import { Global, ResourceType } from "../global";
import { FileSystemHelper } from "./filesystem.helper";
import { Terminal } from "./terminal";
import { StringHelper } from "../utilities/string.helper";
import { MiscHelper } from "../utilities/misc.helper";

class ResourceConfiguration {
	configurationFilename = null;
	fileSystemHelper: FileSystemHelper;
	terminal: Terminal;

	constructor() {
		var defaultConfigFilename = this.defaultConfigFilename();
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

	public filterExcludedFiles(fileList: string[], ignoreList: string[]) {
		fileList.forEach(function(file) {
			//console.log("filterFiles", "EXT: " + path.extname(file) + " : " + file);
		});
	}
	
	/**
	 * TODO: It´s pretty obvious what needs to be don here...
	 */
	public validateConfiguration(configurationData: any) {
		return true;
		//if (StringHelper.isNullOrEmpty(configurationData.root))
	}
	
	/**
	 * EXPERIMENTAL DIRECTORY BASED CONFIGURATION BUILDER
	 */
	public buildConfigurationFromDirectoryStructure(rootPath: string, outputConfigFilename): boolean {
		
		return true;
	}
}

export { ResourceConfiguration }