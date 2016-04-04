/**
 *	Packman - The Asset Machine
 *	@author Patrik Forsberg
 *	@date 2016-03-26
 */

enum WalkOperationEvent {
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

enum ResourceType {
	Unknown,
	Style,
	Script,
}

class Global {
	static CONFIG_FILE: string		= "packman-config.json";

	static Debug					= true;

	static RESOURCE_NAME_STYLESHEET	= "style";
	static RESOURCE_NAME_SCRIPT		= "script";

	// Resource Machine Task Names
	static TASK_MAKE: string		= "make";
	static TASK_CLEAN: string		= "clean";
	static TASK_REPLACE: string		= "replace";
}
 
export { Global, ResourceType }