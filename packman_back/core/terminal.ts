/**
 *	Packman - Web Resource Manager
 *	@name Turbo terminal
 *	@author Patrik Forsberg <patfor@gmail.com>
*/

/// <reference path="../typings/main.d.ts" />

"use strict";

var stringHelper = require("../utilities/string.helper");
var chalk = require("chalk");

/**
 * TODO: Do some serious method cleanup...
 */
class Terminal {
	getClassName(sender: any) {
		var className: string = "";
		var constructorString: string = this.constructor.toString();
		className = constructorString.match(/\w+/g)[1]; 

		return className;
	}

	public log(prefix: string, outputText: string, sender?: any) {
		console.log(prefix + ": " + outputText);
	}

	public echoStatus(prefix: string, statusText: string) {
		console.log(chalk.white.bold(prefix), chalk.green(statusText));
	}
	
	public echo(outputText: string) {
		console.log(chalk.white(outputText));
	}

	public echoPurple(outputText: string, sender?: any) {
		console.log(chalk.white.bgMagenta.bold("%s"), outputText);
	}

	public echoDebug(outputText: string) {
		console.log(chalk.bold("%s"), outputText);
	}

	public echoSetting(setting: string, value: string): void {
		console.log(chalk.black.bgWhite(setting + " " + value));
	}

	public echoInfo(outputText: string) {
		console.log(chalk.bold("%s"), ">> " + outputText);
	}

	public echoGreenInfo(outputText: string) {
		console.log(chalk.green.bold("%s"), ">> " + outputText);
	}

	public echoPrefixedCyan(outputText: string, filename: string) {
		console.log(chalk.cyan.bold(outputText), chalk.cyan.bold(filename));
	}

	public echoPrefixedMagenta(outputText: string, filename: string) {
		console.log(chalk.magenta.bold(outputText), chalk.cyan.bold(filename));
	}

	public echoScreamingInfo(outputText: string) {
		console.log(chalk.black.bgWhite.bold("%s"), outputText);
	}

	public echoWarning(outputText: string) {
		console.log(chalk.bold.yellow("%s"), outputText);
	}

	public echoScreamingWarning(outputText: string) {
		console.log(chalk.black.bgYellow.bold("%s"), outputText);
	}

	public echoError(outputText: string) {
		console.log(chalk.bold.red("%s"), outputText);
	}
	
	public echoScreamingError(outputText: string) {
		console.log(chalk.white.bgRed.bold("%s"), outputText);
	}

	public echoMissingFileError(filename: string) {
		var styleError = chalk.red;
		var styleBoldError = chalk.bold.red;

		console.log(styleError('File "') + styleBoldError(filename) + styleError('" was not found!'));
	}

	getLongestLine(array): number {
		var max = 0;
		for (var index in array) {
			var text = array[index];
			if (text.length > max) max = text.length;
		}
		
		return max;
	}

	repeatChar(char, numberOfTimes): string {
		var result = "";
		
		for (var i = 0; i < numberOfTimes; i++) {
			result += char;
		}
			
		return result;
	}

	public echoArray(title: string, data: string[], error?: boolean) {
		if (data === undefined) {
			data = new Array<string>();
			data.push("No data");
		}
		
		var boldRed = chalk.bold.red;
		var boldWhite = chalk.bold.white;
		var textColor = error ? boldRed : boldWhite;
		var lineNum = 0;

		var longestLine = this.getLongestLine(data);
		var titleLength = title.length;
		
		if (titleLength > longestLine) {
			longestLine = titleLength;
		}
		
		longestLine = longestLine + 3;

		console.log(" ");
		console.log(textColor(title));
		console.log(textColor(this.repeatChar("-", longestLine)));
		
		for (var i = 0; i < data.length; i++) {
			lineNum++;
			console.log("*", textColor(data[i]));
		}
		
		console.log(" ");
	}
}

export { Terminal }