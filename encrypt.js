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