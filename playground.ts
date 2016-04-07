/**
 *	@name Zynaptic HTML Parser
 *	@version 0.2	
 *	@date 2016-04-07
 *	@author Patrik Forsberg <mail@patrikforsberg.net>
 *	@web www.patrikforsberg.net
 *	@copyright Patrik Forsberg, some rights reserved
 * 
 *	@desc
 *	This is a super simple HTML Parser/Tag Parser it´s
 *	designed to provide a backend for simple rick text display,
 *	it is used in the Zynaptic Turbo Terminal project to provide
 *	simple rich text features for the Node command line.
 *	
 *	You can also find it used in action in my HTML Substring
 *	Node Module, a perfect use case since this parser is not
 *	designed to recover or from nor even handle errenous HTML
 *	it will simply fail (like old good Netscape :)
 *
 *	However it´s perfect for projects where you need a small,
 *	super fast parser where you control the HTML input  
 *
 *	Have fun and please let me know if you use it for something
 *	cool and nifty :)
 *
 *	Oh, and by the way, it´s free, do whatever you want with it
 *	as long as you don´t hold me responsible if you mess something up :) 
*/
console.log("test");

"use strict";

var stringBuffer: string[] = ["Kalle", "Balle", "Skalle"];

console.log(stringBuffer.join(" "));

/*
function richEcho(...textParts: any[]) {
    var outputText = "";
    for (var i = 0; i < textParts.length; i++) {
		outputText += textParts[i];
	}
    return outputText;
}

function richEcho(...dataArray: any[]) {
	var outputText = dataArray.join(" ");
	return outputText;
}

console.log("RE-1", richEcho("1", "2sdf", "4", "dfsfsd"));

*/



var htmlString = `
	<div>
		<h1>Hello man</h1>
		<b>Here comes a list</b>
		<br />
		<ul>
			<li>Item 1</li>
			<li>Item 2</li>
			<li>Item 3</li>
		</ul>
	</div>
`

class PutteSimpleHtml {
	stack: any[];
	constructor() {
		this.stack = new Array<any>();
	}	
	
}
var aarray = "pojopj"; //new Array<string>();



console.log( typeof aarray)

var previousChar: string = "";
var currentChar: string = "";
var inTag: Boolean = false;

for (var i = 0; i < htmlString.length; i++) {
}

