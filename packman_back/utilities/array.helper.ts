/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

class ArrayHelper {
	/**
	 * Add the contents of an array into another array,
	 * duplicates are ignores.
	 * 
	 * These functions coukd use some optimizations
	 */	
	static containsStringNoCase(array: string[], itemText: string): number {
		for (var i = 0; i < array.length; i++) {
			var item = array[i];
			if (item.toLowerCase() == itemText.toLowerCase()) {
				return i;
			}
		}
		return -1;
	}

	public valueInArray(value, associativeArray) {
		var haveValue = false;
		
		for (var i = 0; i < associativeArray.length; i++) {
			if (associativeArray[i] == value) {
				haveValue = true;
				break;
			}       
		}

		return haveValue;
	}

	// Array.prototype.push.apply(filesInBundle, files);
	static arrayMerge(masterArray: string[], valuesArray: string[]) {
		var self = this;
		valuesArray.forEach(function(item) {
			if (self.containsStringNoCase(masterArray, item) == -1) {
				masterArray.push(item);
			}
		});
	}
}

export { ArrayHelper }
