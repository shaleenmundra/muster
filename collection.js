var utils = require('./utils');

/**
* A small javascript library to workwith arrays in Javascript.
*
* @author Danilo Oliveira
* @constructor
* @param {array} list - the array with the items of the kollection.
*/
var Collection = function(list){
	this.items = list || [];
};

Collection.prototype = {
	/**
	* Get all of the items in the kollection.
	*
	* @returns {Array}
	*/
	all(){
		return this.items;
	},

	/**
	* Get the average value of a given key.
	*
	* @param {(string|function)} callback
	* @returns {*}
	*/
	avg(key){
		var count = this.count();

		if(count > 0){
			return this.sum(key) / count;
		}
	},

	/**
	* Chunk the underlying kollection array.
	*
	* @param {int} size
	* @returns {Collection}
	*/
	chunk(size){
		var chunk = [];
		var count = this.count();

		for(var i = 0; i < count; i += size){
			chunk.push(this.items.slice(i, i + size));
		}

		return new Collection(chunk);
	},

	/**
	* Collapse the kollection of items into a single array.
	*
	* @returns {Collection}
	*/
	collapse(){
		return new Collection(this.reduce(function(prev, cur){
			var more = [].concat(cur).some(Array.isArray);
			return prev.concat(more ? cur.flatten() : cur);
		}, []));
	},

	/**
	* Create a kollection by using this kollection for keys and another for its values.
	*
	* @param {*} values
	* @returns {Collection}
	*/
	combine(values){
		// TODO:
	},

	/**
	* Determine if an item exists in the kollection.
	*
	* @param {*} key
	* @param {*} value
	* @returns bool
	*/
	contains(arg0, arg1){
		if(arg0 instanceof Function){
			var contains = false;

			this.items.forEach(function(item, index){
				contains |= arg0(index, item);
			});

			return !!contains;
		} else if(arg1) {
			var contains = false;

			this.items.forEach(function(item){
				contains |= item[arg0] == arg1;
			});

			return !!contains;
		} else {
			return !!~this.items.indexOf(arg0);
		}
	},

	/**
	* Count the number of items in the kollection.
	*
	* @returns int
	*/
	count(){
		return this.items.length;
	},

	/**
	* Get the items in the kollection that are not present in the given items.
	*
	* @param {*} items
	* @returns {Collection}
	*/
	diff(items){
		return this.filter(function(i){
			return items.indexOf(i) < 0;
		});
	},

	/**
	* Execute a callback over each item.
	*
	* @param {function} callback
	* @returns this
	*/
	each(callback){
		this.items.every(function(item, index, arr){
			return callback(item, index, arr) !== false;
		});
	},

	/**
	* Create a new kollection consisting of every n-th element.
	*
	* @param {int} step
	* @param {int} offset
	* @returns {Collection}
	*/
	every(step, _offset){
		var arr = [], offset = _offset || 0;

		this.each(function(item, index, haystack){
			if(index % step == 0){
				arr.push(haystack[index + offset]);
			}
		});

		return arr;
	},

	/**
	* Get all items except for those with the specified keys.
	*
	* @param {*} keys
	* @returns {Collection}
	*/
	except(keys){
		// TODO:
	},

	/**
	* Run a filter over each of the items.
	*
	* @param {(function|null)} callback
	* @returns {Collection}
	*/
	filter(callback){
		return new Collection(this.items.filter(callback));
	},

	/**
	* Get the first item from the kollection.
	*
	* @param {(function|null)} callback
	* @param {*} default
	* @returns {*}
	*/
	first(callback){
		var first = null;

		if(callback){
			for(var index = 0; index < this.items.length; index++){
				var item = this.items[index]
				if(callback(item, index)){
					first = item;
					break;
				}
			}
		} else {
			first = this.items[0] || null;
		}

		return first;
	},

	/**
	* Get a flattened array of the items in the kollection.
	*
	* @param {int} depth
	* @returns {Collection}
	*/
	flatten(){
		return this.collapse(this.items);
	},

	/**
	* Flip the items in the kollection.
	*
	* @returns {Collection}
	*/
	flip(){
		var flipped = [];

		this.items.forEach(function(item){
			var newObj = {};
			Object.keys(item).forEach(function(key){
				newObj[item[key]] = key;
			});

			flipped.push(newObj);
		});

		return new Collection(flipped);
	},

	/**
	* Remove an item from the kollection by key.
	*
	* @param {(string|array)} keys
	* @returns this
	*/
	forget(keys){
		if(!keys){
			throw new Error('You need to specify one or more keys to the method forget.');
		}

		if(!Array.isArray(keys)){
			keys = [keys];
		}

		var items = this.items;

		keys.forEach(function(key){
			items.forEach(function(item){
				if(Array.isArray(item)){
					!!~item.indexOf(key) && item.splice(key, 1);
				} else if(item[key]){
					delete item[key];
				}
			});
		});
	},

	/**
	* "Paginate" the kollection by slicing it into a smaller kollection.
	*
	* @param {int} page
	* @param {int} perPage
	* @returns {Collection}
	*/
	forPage(page, items){
		var maxPage = this.items.length / items;

		if(page < 0 || page > maxPage){
			throw new Error('Page out of the bounds');
		}

		return new Collection(this.items.slice((page * items) - items, page * items));
	},

	/**
	* Search the kollection for a given value using fuzzy algorithm.
	*
	* @param {*} value
	* @returns {*}
	*/
	fuzzySearch(){
		// TODO:
	},

	/**
	* Get an item from the kollection by key.
	*
	* @param {int} key
	* @param {*} callback
	* @returns {*}
	*/
	get(key, callback){
		var item = this.items[key];

		if(item){
			return item;
		} else if(callback){
			return ((callback instanceof Function) ? callback() : callback);
		} else {
			return null;
		}
	},

	/**
	* Group an associative array by a field or using a callback.
	*
	* @param {(function|string)} groupBy
	* @param {bool} preserveKeys
	* @returns {Collection}
	*/
	groupBy(arg0){
		var group = {};

		this.items.forEach(function(item, key){
			var _key = (arg0 instanceof Function) ? arg0(item, key) : item[arg0];

			if(!group[_key]){
				group[_key] = new Array();
			}

			group[_key].push(item);
		});

		return group;
	},

	/**
	* Determine if an item exists in the kollection by key.
	*
	* @param {*} key
	* @returns bool
	*/
	has(key){
		return !!this.items[key];
	},

	/**
	* Concatenate values of a given key as a string.
	*
	* @param {string} value
	* @param {string} glue
	* @returns string
	*/
	implode(key, glue){
		if(glue){
			var arr = [];

			this.items.forEach(function(item){
				arr.push(item[key]);
			});

			return arr.join(glue);
		} else {
			return this.items.join(key);
		}
	},

	/**
	* Intersect the kollection with the given items.
	*
	* @param {*} items
	* @returns {Collection}
	*/
	intersect(items){
		var newArr = [];

		if(items instanceof Collection){
			items = items.all();
		}

		this.items.forEach(function(item, key){
			if(~items.indexOf(item)){
				newArr[key] = item;
			}
		});

		return new Collection(newArr);
	},

	/**
	* Determine if the kollection is empty or not.
	*
	* @returns bool
	*/
	isEmpty(){
		return !this.items.length;
	},

	/**
	* Key an associative array by a field or using a callback.
	*
	* @param {(function|string)} keyBy
	* @returns {Collection}
	*/
	keyBy(keyBy){
		var results = {};

		this.items.forEach(function(item, key){
			var _key = (keyBy instanceof Function) ? keyBy(item) : item[keyBy];
			results[_key] = item;
		});

		return results;
	},

	/**
	* Get the keys of the kollection items.
	*
	* @returns {Collection}
	*/
	keys(){
		var keys = [];

		this.items.forEach(function(item, key){
			keys.push(key);
		});

		return new Collection(keys);
	},

	/**
	* Get the last item from the kollection.
	*
	* @param {(function|null)} callback
	* @param {*} default
	* @returns {*}
	*/
	last(callback){
		if(callback){
			var arr = [];

			this.items.forEach(function(item, key){
				if(callback(item, key)){
					arr.push(item);
				}
			});

			return arr[arr.length - 1] || null;
		} else {
			return this.items[this.items.length - 1] || null;
		}
	},

	/**
	* Run a map over each of the items.
	*
	* @param {function} callback
	* @returns {Collection}
	*/
	map(callback){
		return new Collection(this.items.map(callback));
	},

	/**
	* Get the max value of a given key.
	*
	* @param {(string|null)} key
	* @returns {*}
	*/
	max(key){
		var getValue = function(item){
			return (key) ? item[key] : item;
		};

		var max = getValue(this.get(0));

		this.each(function(item){
			if(getValue(item) > max){
				max = getValue(item);
			}
		});

		return max;
	},

	/**
	* Get the median of a given key.
	*
	* @param null key
	* @returns {*}|null
	*/
	median(key){
		var middle = Math.ceil(this.count() / 2) - 1;

		if(key){
			return this.sortBy(key).get(middle)[key];
		} else {
			return this.sort().get(middle);
		}
	},

	/**
	* Merge the kollection with the given items.
	*
	* @param {*} items
	* @returns {Collection}
	*/
	merge(){
		return new Collection(this.items.concat.apply(this.items, arguments));
	},

	/**
	* Get the min value of a given key.
	*
	* @param {(string|null)} key
	* @returns {*}
	*/
	min(key){
		var getValue = function(item){
			return (key) ? item[key] : item;
		};

		var min = getValue(this.get(0));

		this.each(function(item){
			if(getValue(item) < min){
				min = getValue(item);
			}
		});

		return min;
	},

	/**
	* Get the mode of a given key.
	*
	* @param {(string|null)} key
	* @returns {Array}
	*/
	mode(key){
		// TODO:
	},

	/**
	* Pass the kollection to the given callback and return the result.
	*
	* @param {function} callback
	* @returns {*}
	*/
	pipe(callback){
		return callback(this);
	},

	/**
	* Get the values of a given key.
	*
	* @param {string} value
	* @returns {Collection}
	*/
	pluck(key){
		var plucked = [];

		this.each(function(item){
			plucked.push(item[key]);
		});

		return new Collection(plucked);
	},

	/**
	* Get and remove the last item from the kollection.
	*
	* @returns {*}
	*/
	pop(){
		return this.items.pop();
	},

	/**
	* Push an item onto the beginning of the kollection.
	*
	* @param {*} value
	* @param {*} key
	* @returns this
	*/
	prepend(value){
		return this.items.unshift(value);
	},

	/**
	* Get and remove an item from the kollection.
	*
	* @param {*} key
	* @returns this
	*/
	pull(key){
		return this.items.splice(key, 1)[0];
	},

	/**
	* Push an item onto the end of the kollection.
	*
	* @param {*} value
	* @returns this
	*/
	push(item){
		return this.items.push(item);
	},

	/**
	* Get one or more items randomly from the kollection.
	*
	* @param {int} amount
	* @returns {*}
	*/
	random(amount){
		amount = amount || 1;

		var count = this.count();

		if (amount > count) {
			throw new Error('You requested ${amount} items, but there are only ${count} items in the kollection');
		}

		if(amount > 1){
			var arr = [];

			for(var i = 0; i < amount; i++){
				arr.push(this.items[utils.randomInt(0, this.items.length - 1)]);
			}

			return new Collection(arr);
		} else {
			return this.items[utils.randomInt(0, this.items.length - 1)];
		}
	},

	/**
	* Reduce the kollection to a single value.
	*
	* @param {function} callback
	* @param {*} initial
	* @returns {*}
	*/
	reduce(){
		return this.items.reduce.apply(this.items, arguments);
	},

	/**
	* Create a kollection of all elements that do not pass a given truth test.
	*
	* @param {function} callback
	* @returns {Collection}
	*/
	reject(callback){
		return this.filter(function(item, index){
			return !callback(item, index);
		});
	},

	/**
	* Reverse items order.
	*
	* @returns {Collection}
	*/
	reverse(){
		return new Collection(this.items.reverse());
	},

	/**
	* Search the kollection for a given value and return the corresponding key if successful.
	*
	* @param {*} value
	* @param {bool} strict
	* @returns {*}
	*/
	search(value, strict){
		var index = -1;

		if(value instanceof Function){
			this.each(function(item, key){
				if(value(item, key)){
					index = key;

					return false;
				}
			});
		} else if(strict){
			index = this.items.indexOf(value);
		} else {
			this.each(function(item, key){
				if(item == value){
					index = key;

					return false;
				}
			});
		}

		return (index < 0) ? false : index;
	},

	/**
	* Get and remove the first item from the kollection.
	*
	* @returns {*}
	*/
	shift(){
		return this.items.shift();
	},

	/**
	* Shuffle the items in the kollection.
	*
	* @returns {Collection}
	*/
	shuffle(){
		var o = utils.copy(this.items);

		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

		return new Collection(o);
	},

	/**
	* Slice the underlying kollection array.
	*
	* @param {int} offset
	* @param {int} length
	* @returns {Collection}
	*/
	slice(offset, length){
		return new Collection(this.items.slice(offset, (length) ? offset + length : this.items.length));
	},


	/**
	* Sort through each item with a callback.
	*
	* @param {(function|null)} callback
	* @returns {Collection}
	*/
	sort(callback){
		return new Collection(utils.copy(this.items).sort(callback));
	},

	/**
	* Sort the kollection using the given callback.
	*
	* @param {(function|string)} callback
	* @param {int} options
	* @param {bool} descending
	* @returns {Collection}
	*/
	sortBy(key){
		return new Collection(utils.copy(this.items).sort(function (_a, _b){
			var a = (key instanceof Function) ? key(_a) : _a[key];
			var b = (key instanceof Function) ? key(_b) : _b[key];

			return (a > b) ? 1 : (a < b) ? -1 : 0;
		}));
	},

	/**
	* Sort the kollection in descending order using the given callback.
	*
	* @param {(function|string)} callback
	* @param {int} options
	* @returns {Collection}
	*/
	sortByDesc(key){
		return new Collection(utils.copy(this.items).sort(function (_a, _b){
			var a = (key instanceof Function) ? key(_a) : _a[key];
			var b = (key instanceof Function) ? key(_b) : _b[key];

			return (a < b) ? 1 : (a > b) ? -1 : 0;
		}));
	},

	/**
	* Splice a portion of the underlying kollection array.
	*
	* @param {int} offset
	* @param {(int|null)} length
	* @param {*} replacement
	* @returns {Collection}
	*/
	splice(index, limit, replace){
		var args = null;

		if(replace instanceof Array){
			replace.unshift(index, limit);

			args = replace;
		}

		return new Collection(this.items.splice.apply(this.items, args || arguments));
	},

	/**
	* Get the sum of the given values.
	*
	* @param {(function|string|null)} callback
	* @returns {*}
	*/
	sum(key){
		return this.reduce(function (_a, _b) {
			var a = (key instanceof Function && _a instanceof Object) ? key(_a) : (_a[key]) ? _a[key] : _a;
			var b = (key instanceof Function) ? key(_b) : (_b[key]) ? _b[key] : _b;

			return a + b;
		}, 0);
	},

	/**
	* Take the first or last {$limit} items.
	*
	* @param {int} limit
	* @returns {Collection}
	*/
	take(items){
		if(items < 0){
			return new Collection(this.items.slice(this.items.length - (-items)));
		} else {
			return new Collection(this.items.slice(0, items));
		}
	},

	/**
	* Converts the items in a string.
	*
	* @returns {Collection}
	*/
	toString(){
		return JSON.stringify(this.items);
	},

	/**
	* Transform each item in the kollection using a callback.
	*
	* @param {function} callback
	* @returns this
	*/
	transform(callback){
		this.items = this.items.map(callback);
	},

	/**
	* Union the kollection with the given items.
	*
	* @param {*} items
	* @returns {Collection}
	*/
	union(items){
		return this.merge(items).unique(function(item){
			return JSON.stringify(item);
		});
	},

	/**
	* Return only unique items from the kollection array.
	*
	* @param {(string|function|null)} key
	* @param {bool} strict
	*
	* @returns {Collection}
	*/
	unique(key){
		var arr = [], aux = [];

		this.items.forEach(function (_item) {
			var item = (key instanceof Function) ? key(_item) : (_item[key]) ? _item[key] : _item;

			if(!~aux.indexOf(item)){
				aux.push(item);
				arr.push(_item);
			}
		});

		return new Collection(arr);
	},

	/**
	* Reset the keys on the underlying array.
	*
	* @returns {Collection}
	*/
	values(){
		var items = utils.copy(this.items).filter(Boolean);

		return new Collection(items);
	},

	/**
	* Filter items by the given key value pair.
	*
	* @param {string} key
	* @param {*} operator
	* @param {*} value
	* @returns {Collection}
	*/
	where(key, operator, value){
		if(!value){
			value = operator;
			operator = '=';
		}

		return this.filter(function(item, index){
			return utils.operate(item[key], operator, value);
		});
	},

	/**
	* Filter items by the given key values pair.
	*
	* @param {string} key
	* @param {Array} values
	* @returns {Collection}
	*/
	whereIn(key, values){
		return this.filter(function(item, index){
			return !!~values.indexOf(item[key]);
		});
	},

	/**
	* Filter items by the given key date pair.
	*
	* @param {string} key
	* @param {Date} date
	* @returns {Collection}
	*/
	whereDate(key, date){
		if(!(date instanceof Date)){
			throw new Error('Second argument must be an Date object');
		}

		return this.filter(function(item){
			return item[key].toDateString() === date.toDateString();
		});
	},

	/**
	* Filter items by the date between initial and final dates.
	*
	* @param {string} key
	* @param {Date} initial
	* @param {Date} final
	* @returns {Collection}
	*/
	whereDateBetween(key, initial, final){
		if(!(initial instanceof Date) || !(initial instanceof Date)){
			throw new Error('Dates argument must be an Date object');
		}

		return this.filter(function(item){
			return initial < item[key] && item[key] < final;
		});
	},

	/**
	* Filter items by the given key value pair using strict comparison.
	*
	* @param {string} key
	* @param {*} value
	* @returns {Collection}
	*/
	whereStrict(key, value){
		return this.filter(function(item, index){
			return utils.operate(item[key], '===', value);
		});
	},

	/**
	* Zip the kollection together with one or more arrays.
	*
	* e.g. new Collection([1, 2, 3]).zip([4, 5, 6]);
	*   => [[1, 4], [2, 5], [3, 6]]
	*
	* @param {array} items
	* @returns {Collection}
	*/
	zip(arg0){
		var arr = [];

		this.items.forEach(function(item, key){
			arr.push([item, arg0[key] || null]);
		});

		return new Collection(arr);
	}
};

module.exports = Collection;
