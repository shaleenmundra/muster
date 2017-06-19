var utils = {
	/**
	* Get an operator checker callback.
	*
	* @param mixed value1
	* @param string operator
	* @param mixed value2
	* @return mixed result
	*/
	operate(value1, operator, value2){
		switch(operator){
			default:
			case '=':
			case '==': return value1 == value2;
			case '!=':
			case '<>': return value1 != value2;
			case '<': return value1 < value2;
			case '>': return value1 > value2;
			case '<=': return value1 <= value2;
			case '>=': return value1 >= value2;
			case '===': return value1 === value2;
			case '!==': return value1 !== value2;
			case 'like': return value1.includes(value2);
		}
	},

	/**
	* Generate an random integer ranging from a given begin to limit.
	*
	* @param int begin
	* @param int limit
	* @return int random
	*/
	randomInt(begin, limit){
		return Math.floor((Math.random() * limit) + begin);
	},

	extend(obj, src){
		return Object.assign(obj, src);
	},

	/**
	* Makes an exact copy of a given array.
	*
	* @param Array arr
	* @return Array result
	*/
	copy(arr){
		return arr.slice();
	},

	/**
	* No operation.
	*
	* @return function result
	*/
	noop(){}
};

module.exports = utils;
