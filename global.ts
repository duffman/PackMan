/**
 *	Packman - Resource Compiler
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
		export var defaultConfigFilename = "resources.config.json";
		export var debug = true;
		export var terminateOnError: boolean = false;
		export var allowMissingFiles: boolean = true;
	}
}

export { Global, Types, Constants }
