/**
 *	Packman - The Asset Pipe Machine
 *	@author Patrik Forsberg
 *	@date 2016
 */

/// <reference path="../typings/main.d.ts" />

"use strict";

var gulpSass = require("gulp-sass");

import { IWorker } from "./worker.interface";

class SassWorker implements IWorker {
	public executeWorker(): boolean {
		return true;
	}
}