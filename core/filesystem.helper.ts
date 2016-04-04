/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

var walker		= require("walk");
var fs			= require("fs");
var walk		= require("fs-walk");
var path		= require("path") ;
var jsonfile	= require("jsonfile");

import { Terminal } from "./terminal";

class FileSystemHelper {
	constructor() {
	}

	public getFilesInDirectory(directoryPath, ignoreList?: string[]) : any {
		var dirContents = fs.readdirSync(directoryPath);
		var files = []; 

		for (var index in dirContents) {
			var fullPath = path.join(directoryPath, dirContents[index]);
			if (fs.lstatSync(fullPath).isFile()) {
				files.push(fullPath);
			}
		}

		return files;
	}

	getStat(source: string): any {
		var result: any = null;		
		
		try {
			result = fs.lstatSync(source);
		}
		catch (e) {
		}
		
		return result;
	}


	public isFile(fullPath: string): boolean {
		var stat = this.getStat(fullPath);
		return true;	
	}
	
	public static fileOrDirectoryExists(source: string): boolean {
		var sourceExists = false;
		
		if (fs.existsSync(source)) {
			var stat = fs.lstatSync(source);

			if (stat.isFile() || stat.isDirectory()) {
				sourceExists = true;
			}
		}
		
		return sourceExists;
	}
	
	getFileParts(fullFilename) {
		const KEY_FILENAME = "FILENAME";
		const KEY_PATH = "FILE_PATH";

		var extractedPath = path.dirname(fullFilename);
		var extractedFilename = path.basename(fullFilename);

		return {
			KEY_FILENAME: extractedFilename,
			KEY_PATH: extractedPath
		}		
	}
	
	public static fileExists(fullFilename: string): boolean {
		return true;
	}
}

export { FileSystemHelper }
