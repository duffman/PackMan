"use strict";

import { Promise } from "ts-promise";


var prom = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(42);
        // or e.g.: reject(new Error("boom"));
    }, 100);
});



/// Hello world
Promise.resolve("test").then((v) => {
	console.log(v);
});

var p = Promise.resolve();

/*
Promise.setLongTraces(true);
var p = Promise.resolve();
p.then(() => {
	//return Promise.reject(new Error("my error"));
}).catch((e) => {
	console.error(e.stack);
});
*/