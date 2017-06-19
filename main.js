var Collection = require('./collection');
var collect = (arr) => new Collection(arr);

module.exports = {
	Collection: Collection,
	collect: collect
};
