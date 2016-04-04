/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

class StringHelper {
	static isNullOrEmpty(value: any) {
		return value == undefined || value == null ||
			(typeof value === "string" && value.toString().length == 0);
	}
}

export { StringHelper }
