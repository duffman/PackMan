/**
 *	Packman - Web Resource Manager
 *	@author Mattias Högström & Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

import { Global, Types } from "../global";
import { Terminal } from "./terminal";
import { ConfigurationProcessor } from "./configuration/configuration.processor"

var path        	= require('path') ;
var jsonfile    	= require('jsonfile');

class MasterConfigurationProcessor {
	public configurations: any[];
	
	configurationProcessor: ConfigurationProcessor;
	terminal: Terminal;

	constructor() {
		this.terminal = new Terminal();
		this.configurations = new Array<any>();
		this.configurationProcessor = new ConfigurationProcessor();
	}
	
	public parseConfiguration(configurationFileName: string) {
		var configurationData = this.configurationProcessor.getConfigurationData(configurationFileName);

		if (configurationData == null) {
			this.terminal.echoScreamingError("Invalid configuration data from \"" + configurationFileName + "\"");
			
			if (Global.Settings.terminateOnError) {
				this.terminal.echoScreamingError("Terminating...");
				process.exit(1);				
			}
		}
		
		for (var index in configurationData.configurations) {
			var config = configurationData.configurations[index];
			this.configurations.push(config);
		}
	} 
	
	public getSourceForName(name: string) {
		var sourceFilename: string = "";
		for (var i = 0; i < this.configurations.length; i++) {
			var source =  this.configurations[i];
			
			if (source.run == name) {
				sourceFilename = source.src;
				break;
			}
		}
		
		return sourceFilename;		
	}
}

export { MasterConfigurationProcessor }