/**
 *	Packman - Web Resource Manager
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

var path = require("path");

import { Global, Constants, Types } from "../global";
import { FileSystemHelper } from "./filesystem.helper";
import { Terminal } from "./terminal";
import { StringHelper } from "../utilities/string.helper";
import { MiscHelper } from "../utilities/misc.helper";

class ResourceConfiguration {
	configurationFilename = null;
	fileSystemHelper: FileSystemHelper;
	terminal: Terminal;

	constructor() {
		this.terminal = new Terminal();
	}
	
	getResourceTypeFromString(resourceName: string) {
		var resourceType = Types.ResourceType.Unknown;

		switch (resourceName.toLowerCase()) {
			case Constants.RESOURCE_NAME_STYLESHEET:
				resourceType = Types.ResourceType.Style
				break;
			case Constants.RESOURCE_NAME_SCRIPT:
				resourceType = Types.ResourceType.Script
				break;
		}
		
		return resourceType;
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
		var haveFileList: boolean = !MiscHelper.isNullOrEmpty(fileList);
		var haveIgnoreList = !MiscHelper.isNullOrEmpty(ignoreList);
		
		if (!haveFileList || !haveIgnoreList) {
			return;
		}
	}
	
	/**
	 * TODO: It´s pretty obvious what needs to be done here...
	 */
	public validateConfiguration(configurationData: any) {
		return true;
		//if (StringHelper.isNullOrEmpty(configurationData.root))
	}
	
	useAbsolutePathForPart(part) {
		return part.absolutePath != undefined && part.absolutePath;
	}
}

export { ResourceConfiguration }