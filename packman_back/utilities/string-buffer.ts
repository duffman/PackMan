/**
 *	Simple "StringBufer"" implementation
 *	@author Patrik Forsberg <patfor@gmail.com>
 *	@2016-04-07
 * 
 *	This class is a convenience class really, it´s not
 *	made for performance reasons since pretty much all
 *	JavaScript VM´s got you covered there.
 *	This is an attempt to prettify the uggliest
 *	operation there is in software programming,
 *	and that is, string concatenations.
 */

class StringBuffer  {
	public dataStorage: string[];
	constructor() {
		this.dataStorage = new Array<string>();
	}
	
	prepareData(data: any, quoted?: boolean): string {
		var stringData: string = "";
		
		if (data != undefined && data != null) {
			stringData = data.toString();
		}

		if (quoted)	{
			stringData = '"' + stringData + '"';
		}	

		return stringData;
	}
	
	public append(data: any, quoted?: boolean): StringBuffer {
		var stringData = this.prepareData(data, quoted);
		this.dataStorage.push(stringData);
		return this;
	}
	
	public prepend(data: any, quoted?: boolean): StringBuffer {
		var stringData = this.prepareData(data, quoted);
		this.dataStorage.unshift(stringData);
		return this;
	}
	
	public clear() {
		this.dataStorage.length = 0;
	}
	
	public toString() {
		return this.dataStorage.join(" ");
	}
	
	/* TODO: append and prepend StringBuffer object
	if( Object.prototype.toString.call( data ) === '[object Array]' ) {
		console.log( 'Array!' );
	}
	*/
}

export { StringBuffer }