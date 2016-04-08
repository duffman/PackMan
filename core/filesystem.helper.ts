/**
 *	Packman -  Resource Compiler
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

var walker		= require("walk");
var fs			= require("fs");
var walk		= require("fs-walk");
var path		= require("path") ;

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
		
		if (fs.existsSync(source)) {
			result = fs.lstatSync(source);
		}		
		
		return result;
	}

	public fileExists(source: string): boolean {
		return this.fileOrDirectoryExists(source, true);
	}
		
	public isFile(source: string) {
		var status = this.getStat(source);
		return status != null && status.isFile();
	}
	public isDirectory(source: string) {
		var status = this.getStat(source);
		return status != null && status.isDirectory();
	}
	
	public extractFilename(source: string): string {
		return path.basename(source);
	}
	
	public fileOrDirectoryExists(source: string, isFile?: boolean): boolean {
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
