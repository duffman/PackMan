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

import { Global } from "../global";
import { Terminal } from "./terminal";
import { ResourceProcessor } from "./resource.processor";

class ResourceGenerator {
	terminal = new Terminal();
	resourceProcessor: ResourceProcessor;

	constructor() {
		this.terminal.echoPurple("Resource File Generator 0.3");
	}

	parseDirectory(fullPath, filesArray) {
		console.log("parseDirectory", fullPath);
		var stat = fs.statSync(fullPath);
	}

	public run() {
		this.terminal.echoInfo("Running Resource File Generator");
	}
}

export { ResourceGenerator }

var generator = new ResourceGenerator();
 