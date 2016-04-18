/**
 *	Packman - Web Resource Manager
 *	@author Patrik Forsberg
 *	@date 2016-04-02
 */

/// <reference path="../../typings/main.d.ts" />

"use strict";

import { Terminal } from "./../terminal";

var jsonFile = require("jsonfile");

class ConfigurationProcessor {
	terminal: Terminal;

	constructor() {
		this.terminal = new Terminal();
	}
	
	public getConfigurationData(configurationFileName: string): any {
		var self = this;
		var terminal = this.terminal;
		var configurationData: any = null;

		// Read the main resource configuration file from disk.
		terminal.echoInfo("Reading configuration filename \"" + configurationFileName + "\"");

		try {
			configurationData = jsonFile.readFileSync(configurationFileName, { throws: true });
		}
		catch (exception) {
			terminal.echoScreamingError("Error parsing configuration file, " + exception.toString());
			process.exit(1);
		}	

		return configurationData;
	}	
}

export { ConfigurationProcessor }