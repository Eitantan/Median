/* 
For the encrypt/decrypt function:

MIT License

Copyright (c) 2018 CrypTools

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
String.prototype.encode = function () {
	let array = [];
	for (let i of this) {
		array.push(i.charCodeAt(0));
	}
	return array;
};
var encrypt = function (key) {
	const encoded = this.encode();
	const keyEncoded = key.encode();
	// console.log(keyEncoded)
	let array = encoded.map((x) => {
		x = parseInt(x);
		for (let i of keyEncoded) {
			x = (x + 1) << i % 8;
		}
		keyEncoded.reverse();
		return x;
	});
	if (typeof btoa === "undefined") {
		global.btoa = (str) => new Buffer(str, "binary").toString("base64");
	}
	return btoa(JSON.stringify(array));
};

module.exports = encrypt