/**
 *	Packman - Web Resource Manager
 *	@author Patrik Forsberg
 *	@date 2016-04-18
 */

"use strict"

var commandLineArgs = require('command-line-args');

//{ name: 'section', type: String, multiple: true, defaultOption: true },

class CommandLineProcessor {
	commandLineParser: any;
	
	constructor() {
		this.commandLineParser = commandLineArgs([
			{ name: 'verbose', alias: "v", type: Boolean },
			{ name: 'master', alias: "m", type: String },
			{ name: 'section', alias: "s", type: String }
		]);
	}

	parseOptions(): any {
		var options = this.commandLineParser.parse();
		
		if (options.master == null) {
			console.log("Master file option missing");	
		}
		
		return options;
	}
}

export { CommandLineProcessor }