/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

var walker      	= require("walk");
var fs          	= require("fs");
var path        	= require("path");
var jsonfile    	= require("jsonfile");

import { Global } from "../global";
import { ResourceProcessor } from "./resource-processor";


class CoreService {
	resourceProcessor: ResourceProcessor;

	constructor() {
	}

	parseDirectory(fullPath, filesArray) {
		console.log("parseDirectory", fullPath);
		var stat = fs.statSync(fullPath);
	}

	public run() {
		/*

		var rootSettings = this.configuration.rootSettings;
		
		console.log("Core -> rootPath", rootSettings.rootPath);
		console.log("Core -> followSymLinks", rootSettings.followSymLinks);
		console.log("Core -> verbose", rootSettings.verbose);
		console.log("Core -> minify", rootSettings.minify);
		console.log("Core -> recursive", rootSettings.recursive);
		console.log("Core -> lintFeedback", rootSettings.lintFeedback);
		console.log("Core -> useGitIgnore", rootSettings.useGitIgnore);
		console.log("Core -> exclude", rootSettings.exclude);
		
		var root = rootSettings.rootPath == "." ? __dirname : rootSettings.rootPath;
				
		if (rootSettings.useGitIgnore) {
		}
		
		var walkerOptions = {
			followLinks: rootSettings.followSymLinks,
			filters: rootSettings.exclude
		};
		
		console.log('Walker Options', walkerOptions);

		var walkOperation =  walker.walk(root, walkerOptions);
		walkOperation.on("names", this.parseDirectory);
		*/
	}
}

export { CoreService }