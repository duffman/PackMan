/**
 *	Packman - Web Resource Manager
 *	@author Patrik Forsberg
 *	@date 2016-04-02
 */

/// <reference path="../../typings/main.d.ts" />

"use strict";

import { Global } from "../../global";
import { FileSystemHelper } from "../filesystem.helper";
import { Terminal } from "../terminal";

var path		= require("path");
var jsonFile	= require("jsonfile");

class ConfigurationHandler {
	applicationRoot: string;
	fileSystemHelper: FileSystemHelper;
	terminal: Terminal;

	constructor(appRoot: string) {
		this.applicationRoot = appRoot;
		this.fileSystemHelper = new FileSystemHelper();
		this.terminal = new Terminal();
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
	decideOnConfigurationFilename(defaultFilename: string, configFileParam?: string): string {
		var configFilename = path.join(this.applicationRoot, defaultFilename);
		var haveConfigFileParam = configFileParam != null;
		var configFileParamIsDirectory = haveConfigFileParam && this.fileSystemHelper.isDirectory(configFileParam);
		var message:string;
		
		if (haveConfigFileParam && !this.fileSystemHelper.fileOrDirectoryExists(configFileParam)) {
			message = `Invalid configuration filename: "${configFileParam}" terminating.`;
			this.terminal.echoScreamingError(message);
			process.exit(1);
		}
		
		if (this.fileSystemHelper.fileExists(configFileParam) && !configFileParamIsDirectory) {
			configFilename = configFileParam;
			if (Global.Settings.debug) {
				message = `Using provided configuration file parameter "${configFilename}"`;
				this.terminal.echoWarning(message);
			}
		}
		else if (haveConfigFileParam && configFileParamIsDirectory) {
			configFilename = path.join(configFileParam, Global.Settings.defaultConfigFilename);
			message = `Using path "${configFileParam}" with defaut filename "${Global.Settings.defaultConfigFilename}"`;

			if (Global.Settings.debug) {
				this.terminal.echoInfo(message);
			}
		}
		else if (this.fileSystemHelper.fileExists(configFilename)) {
			message = `No filename or filepath provided, using default "${configFilename}"`;
			this.terminal.echoWarning(message);
		}
		else {
			message = "No configuration file found, I even looked at the default path, try again, bye for now!";
			this.terminal.echoScreamingError(message);
			process.exit(1);	
		}

		return configFilename;
	}
}

export { ConfigurationHandler }