/**
 *	Packman - Web Resource Manager
 *	@author Patrik Forsberg
 *	@date 2016
 */

module Constants {
	export const RESOURCE_NAME_STYLESHEET	= "style";
	export const RESOURCE_NAME_SCRIPT		= "script";

	const APP_CONFIG_FILE			= "packman-config.json";
	const Debug						= true;

	// Resource Machine Task Names
	const TASK_MAKE: string			= "make";
	const TASK_CLEAN: string		= "clean";
	const TASK_REPLACE: string		= "replace";
}

module Types {
	export enum ResourceType {
		Unknown,
		Style,
		Script,
	}

	export enum SourceMapTaskType {
		Unknown,
		Init,
		Write
	}
		
	export enum WalkOperationEvent {
		Names,
		Directory,
		Directories,
		File,
		Files,
		End,
		NodeError,
		DirectoryError,
		Errors
	}
}

module Global {	
	export module Settings {
		export var verbose = false;
		export var masterConfigFilename = "cms.master.json";
		export var defaultConfigFilename = "cms.config.json";
		export var debug = true;
		export var terminateOnError: boolean = true;
		export var allowMissingFiles: boolean = true;
		export var useSourceMaps: boolean = true;
	}
}

export { Global, Types, Constants }
