/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

interface IFileSystemHelper {
	isFile(fullPath: string): boolean;
	sourcePathOrFileExist(fullPath: string): boolean;
}

export { IFileSystemHelper }