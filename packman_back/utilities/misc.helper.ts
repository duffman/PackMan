/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

class MiscHelper {
	public static isNullOrEmpty(value: any): boolean {
		return (MiscHelper.isNullOrUndefined(value)
			|| value.length <= 0) ? true : false;
	}

	public static isNullOrUndefined(value: any) {
		return (value === undefined || value == null)
	}

	getClassName(sender: any): string {
		if (sender == undefined) {
			return "";	
		}
		
		var funcNameRegex = /function (.{1,})\(/;
		var results  = (funcNameRegex).exec(this["constructor"].toString());
		return (results && results.length > 1) ? results[1] : "";
	}
}

export { MiscHelper }