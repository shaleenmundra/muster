var expect = require('chai').expect;

var collect = require('./main').collect;

describe('Collection', function(){
	describe('#all()', function(){
		it('should return the underlying array represented by the collection', function(){
			expect(collect([1, 2, 3]).all()).to.deep.equal([1, 2, 3]);
		});
	});

	describe('#avg()', function(){
		it('should return the average of all items in the collection', function(){
			expect(collect([1, 2, 3, 4, 5]).avg()).to.equal(3);
		});

		it('should return the average of a key in the collection for nested array', function(){
			expect(collect([
				{ name: 'JavaScript: The Good Parts', pages: 176 },
				{ name: 'JavaScript: The Definitive Guide', pages: 1096 }
			]).avg('pages')).to.equal(636);
		});
	});

	describe('#chunk()', function(){
		it('should break the collection into multiple, smaller collections of a given size', function(){
			expect(collect([1, 2, 3, 4, 5, 6, 7]).chunk(4).all()).to.deep.equal([[1, 2, 3, 4], [5, 6, 7]]);
		});
	});

	describe('#collapse()', function(){
		it('should collapse a collection of arrays into a single, flat collection', function(){
			expect(collect([[1, 2, 3], [4, 5, 6], [7, 8, 9]]).collapse().all()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		});
	});

	// describe('#combine()', function(){
	// 	it('should combine the keys of the collection with the values of another array or collection', function(){
	// 		var collection = collect(['name', 'age']);
	// 		var combined = collection.combine(['George', 29]);
	//
	// 		expect(combined.all()).to.deep.equal({ name: 'George', age: 29 });
	// 	});
	// });

	describe('#contains()', function(){
		it('should determine whether the collection contains a given item', function(){
			var collection = collect(['Desk', 'Chair', 'Wardrobe', 'Bookcase']);

			expect(collection.contains('Desk')).to.be.true;
			expect(collection.contains('New York')).to.be.false;
		});

		it('should determine whether the collection contains a given key/value pair', function(){
			var collection = collect([
				{ product: 'Desk', price: 200 },
				{ product: 'Chair', price: 100 }
			]);

			expect(collection.contains('product', 'Desk')).to.be.true;
			expect(collection.contains('product', 'Bookcase')).to.be.false;
		});

		it('should determine whether the collection contains a given item passed a callback', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			expect(collection.contains(function(value, key){
				return value > 5;
			})).to.be.false;

			expect(collection.contains(function(value, key){
				return value < 5;
			})).to.be.true;
		});
	});

	describe('#count()', function(){
		it('should return the total number of items in the collection', function(){
			expect(collect([1, 2, 3, 4]).count()).to.equal(4);
		});
	});

	describe('#diff()', function(){
		it('should return the the diference between array', function(){
			var collection = collect([1, 2, 3, 4, 5]);
			var diff = collection.diff([2, 4, 6, 8]);

			expect(diff.all()).to.deep.equal([1, 3, 5]);
		});
	});

	describe('#each()', function(){
		it('should iterate over the items in the collection', function(){
			var total = 0;

			collect([
				{ product: 'Desk', price: 200 },
				{ product: 'Chair', price: 100 }
			]).each(function(item, key){
				total += item.price;
			});

			expect(total).to.be.equal(300);
		});

		it('should stop iterating when the callback return false', function(){
			var total = 0;

			collect([
				{ product: 'Desk', price: 200 },
				{ product: 'Chair', price: 100 },
				{ product: 'Wardrobe', price: 800 }
			]).each(function(item, key){
				if(key < 2){
					total += item.price;
				} else {
					return false;
				}
			});

			expect(total).to.be.equal(300);
		});
	});

	describe('#every()', function(){
		it('should create a new collection consisting of every n-th element', function(){
			var collection = collect(['a', 'b', 'c', 'd', 'e', 'f']);

			expect(collection.every(4)).to.deep.equal(['a', 'e']);
		});

		it('should create a new collection consisting of every n-th element by offset', function(){
			var collection = collect(['a', 'b', 'c', 'd', 'e', 'f']);

			expect(collection.every(4, 1)).to.deep.equal(['b', 'f']);
		});
	});

	// describe('#except()', function(){
	// 	it('should return all the items in the collection except for those with specified keys', function(){
	// 		var collection = collect({ product_id: 1, price: 100, discount: false });
	// 		var filtered = collection.except(['price', 'discount']);
	//
	// 		expect(filtered.all()).to.deep.equal({ product_id: 1 });
	// 	});
	// });

	describe('#filter()', function(){
		it('should filter the collection using the given callback', function(){
			var collection = collect([1, 2, 3, 4]);
			var filtered = collection.filter(function(value, key){
				return value > 2;
			});

			expect(filtered.all()).to.deep.equal([3, 4]);
		});
	});

	describe('#first()', function(){
		it('should return the first element in the collection', function(){
			var collection = collect([1, 2, 3, 4]);

			expect(collection.first()).to.equal(1);
		});

		it('should return the first element in the collection that passes a given truth test', function(){
			var collection = collect([1, 2, 3, 4]);
			var filtered = collection.first(function(value, key){
				return value > 2;
			});

			expect(filtered).to.equal(3);
		});

		it('should return null in an empty the collection', function(){
			var collection = collect([]);

			expect(collection.first()).to.be.null;
		});

		it('should return null in the collection that does not pases a given truth test', function(){
			var collection = collect([1, 2, 3, 4]);
			var filtered = collection.first(function(value, key){
				return value > 5;
			});

			expect(filtered).to.be.null;
		});
	});

	describe('#flatten()', function(){
		it.skip('should flatten a multi-dimensional collection into a single dimension', function(){
			var collection = collect(['taylor', ['php', 'javascript']]);
			var flattened = collection.flatten();

			expect(flattened.all()).to.deep.equal(['taylor', 'php', 'javascript']);
		});
	});

	describe('#flip()', function(){
		it('should swap the keys of the collection keys with their corresponding values', function(){
			var collection = collect([
				{ product: 'Desk', price: 200 },
				{ product: 'Chair', price: 100 },
				{ product: 'Wardrobe', price: 800 }
			]);
			var flipped = collection.flip();

			expect(flipped.all()).to.deep.equal([
				{ 'Desk': 'product', 200: 'price' },
				{ 'Chair': 'product', 100: 'price' },
				{ 'Wardrobe': 'product', 800: 'price' }
			]);
		});
	});

	describe('#forget()', function(){
		it('should remove an item from the collection by a key', function(){
			var collection = collect([
				{ product: 'Desk', price: 200 },
				{ product: 'Chair', price: 100 },
				{ product: 'Wardrobe', price: 800 }
			]);

			collection.forget('product');

			expect(collection.all()).to.deep.equal([
				{ price: 200 },
				{ price: 100 },
				{ price: 800 }
			]);
		});

		it('should remove an item from the collection by the given keys', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' },
				{ product: 'Wardrobe', price: 800, color: 'blue' }
			]);

			collection.forget(['product', 'color']);

			expect(collection.all()).to.deep.equal([
				{ price: 200 },
				{ price: 100 },
				{ price: 800 }
			]);
		});
	});

	describe('#forPage()', function(){
		it('should return a new collection containing the items for a given page', function(){
			var collection = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
			var chunk = collection.forPage(4, 3);

			expect(chunk.all()).to.deep.equal([10, 11, 12]);
		});
	});

	describe('#get()', function(){
		it('should return the item at a given key', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' },
				{ product: 'Wardrobe', price: 800, color: 'blue' }
			]);

			expect(collection.get(1)).to.deep.equal({ product: 'Chair', price: 100, color: 'green' });
		});

		it('should return a default value if the given key does not exist', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' },
				{ product: 'Wardrobe', price: 800, color: 'blue' }
			]);

			expect(collection.get(5, 'nope')).to.equal('nope');
		});

		it('should return the value returned by the default callback', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' },
				{ product: 'Wardrobe', price: 800, color: 'blue' }
			]);

			expect(collection.get(5, function(){
				return 6 + 1;
			})).to.equal(7);
		});
	});

	describe('#groupBy()', function(){
		it('should group the items in the collection by a given key', function(){
			var collection = collect([
				{account_id: 'account-x10', product: 'Chair'},
				{account_id: 'account-x10', product: 'Bookcase'},
				{account_id: 'account-x11', product: 'Desk'}
			]);

			expect(collection.groupBy('account_id')).to.deep.equal({
				'account-x10': [
					{account_id: 'account-x10', product: 'Chair'},
					{account_id: 'account-x10', product: 'Bookcase'}
				],
				'account-x11': [
					{account_id: 'account-x11', product: 'Desk'}
				]
			});
		});

		it('should group the items in the collection by a given callback', function(){
			var collection = collect([
				{account_id: 'account-x10', product: 'Chair'},
				{account_id: 'account-x10', product: 'Bookcase'},
				{account_id: 'account-x11', product: 'Desk'}
			]);

			expect(collection.groupBy(function(item, key){
				return item.account_id.substring(8);
			})).to.deep.equal({
				'x10': [
					{account_id: 'account-x10', product: 'Chair'},
					{account_id: 'account-x10', product: 'Bookcase'}
				],
				'x11': [
					{account_id: 'account-x11', product: 'Desk'}
				]
			});
		});
	});

	describe('#has()', function(){
		it.skip('should ', function(){

		});
	});

	describe('#implode()', function(){
		it('should join the items in the collection by a given key', function(){
			var collection = collect([
				{account_id: 1, product: 'Desk'},
				{account_id: 2, product: 'Chair'}
			]);

			expect(collection.implode('product', ', ')).to.be.equal('Desk, Chair');
		});

		it('should join the items in the collection', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			expect(collection.implode('-')).to.be.equal('1-2-3-4-5');
		});
	});

	describe('#intersect()', function(){
		it('should remove values that are not on the given array', function(){
			var collection = collect(['Desk', 'Sofa', 'Chair']);
			var intersect = collection.intersect(['Desk', 'Chair', 'Bookcase']);

			expect(intersect.all()).to.deep.equal(['Desk', , 'Chair']);
		});

		it('should remove values that are not on the given collection', function(){
			var collection = collect(['Desk', 'Sofa', 'Chair']);
			var collection2 = collect(['Desk', 'Chair', 'Bookcase']);
			var intersect = collection.intersect(collection2);

			expect(intersect.all()).to.deep.equal(['Desk', , 'Chair']);
		});
	});

	describe('#isEmpty()', function(){
		it('should return true if the collection is empty', function(){
			var collection = collect([]);

			expect(collection.isEmpty()).to.be.true;
		});

		it('should return false if the collection is not empty', function(){
			var collection = collect(['Desk', 'Chair', 'Bookcase']);

			expect(collection.isEmpty()).to.be.false;
		});
	});

	describe('#keyBy()', function(){
		it('should key the collection by the given key', function(){
			var collection = collect([
				{product_id: 'prod-100', name: 'desk'},
				{product_id: 'prod-200', name: 'chair'}
			]);

			expect(collection.keyBy('product_id')).to.deep.equal({
				'prod-100': {product_id: 'prod-100', name: 'desk'},
				'prod-200': {product_id: 'prod-200', name: 'chair'}
			});
		});

		it('should key the collection by the given callback', function(){
			var collection = collect([
				{product_id: 'prod-100', name: 'desk'},
				{product_id: 'prod-200', name: 'chair'}
			]);

			expect(collection.keyBy(function(item){
				return item['product_id'].toUpperCase();
			})).to.deep.equal({
				'PROD-100': {product_id: 'prod-100', name: 'desk'},
				'PROD-200': {product_id: 'prod-200', name: 'chair'}
			});
		});
	});

	describe('#keys()', function(){
		it('should return the keys of the collection', function(){
			var collection = collect(['Desk', 'Chair', 'Bookcase']);

			expect(collection.keys().all()).to.deep.equal([0, 1, 2]);
		});
	});

	describe('#last()', function(){
		it('should return the last element in the collection', function(){
			var collection = collect([1, 2, 3, 4]);

			expect(collection.last()).to.equal(4);
		});

		it('should return the last element in the collection that passes a given truth test', function(){
			var collection = collect([1, 2, 3, 4]);
			var filtered = collection.last(function(value, key){
				return value < 3;
			});

			expect(filtered).to.equal(2);
		});

		it('should return null in an empty the collection', function(){
			var collection = collect([]);

			expect(collection.last()).to.be.null;
		});

		it('should return null in the collection that does not pases a given truth test', function(){
			var collection = collect([1, 2, 3, 4]);
			var filtered = collection.last(function(value, key){
				return value < 0;
			});

			expect(filtered).to.be.null;
		});
	});

	describe('#map()', function(){
		it('should iterate through the collection and passes each value to the given callback', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			var multiplied = collection.map(function(item, key){
				return item * 2;
			});

			expect(multiplied.all()).to.deep.equal([2, 4, 6, 8, 10]);
		});
	});

	describe('#max()', function(){
		it('should return the maximum value of the collection', function(){
			var collection = collect([1, 2, 4, 5, 3]);

			expect(collection.max()).to.equal(5);
		});

		it('should return the maximum value of a given key', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Wardrobe', price: 800, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' }
			]);

			expect(collection.max('price')).to.equal(800);
		});
	});

	describe('#median()', function(){
		it('should get the median of the items in the collection', function(){
			var collection = collect([13, 18, 13, 15, 13, 16, 14, 21, 13]);

			expect(collection.median()).to.equal(14);
		});

		it('should get the median of the items in the collection by a given key', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Wardrobe', price: 800, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' },
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Wardrobe', price: 300, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' }
			]);

			expect(collection.median('product')).to.equal('Desk');
			expect(collection.median('price')).to.equal(200);
			expect(collection.median('color')).to.equal('blue');
		});
	});

	describe('#merge()', function(){
		it('should merge the given array into the collection', function(){
			var collection = collect(['Desk', 'Chair']);
			var merged = collection.merge(['Bookcase', 'Door']);

			expect(merged.all()).to.deep.equal(['Desk', 'Chair', 'Bookcase', 'Door']);
		});
	});

	describe('#min()', function(){
		it('should return the minimum value of the collection', function(){
			var collection = collect([6, 1, 2, 4, 5, 3]);

			expect(collection.min()).to.equal(1);
		});

		it('should return the minimum value of a given key', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' },
				{ product: 'Wardrobe', price: 800, color: 'blue' }
			]);

			expect(collection.min('price')).to.equal(100);
		});
	});

	describe('#mode()', function(){
		it.skip('should get the mode of the items in the collection', function(){

		});
	});

	describe('#pipe()', function(){
		it('should pass the collection to the given callback and returns the result', function(){
			var collection = collect([1, 2, 3]);

			var piped = collection.pipe(function(collection){
				return collection.sum();
			});

			expect(piped).to.equal(6);
		});
	});

	describe('#pluck()', function(){
		it('should retrieve all of the values for a given key', function(){
			var collection = collect([
				{product_id: 'prod-100', name: 'Desk'},
				{product_id: 'prod-200', name: 'Chair'}
			]);

			var plucked = collection.pluck('name');

			expect(plucked.all()).to.deep.equal(['Desk', 'Chair']);
		});
	});

	describe('#pop()', function(){
		it('should remove and returns the last item from the collection', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			expect(collection.pop()).to.equal(5);
			expect(collection.all()).to.deep.equal([1, 2, 3, 4]);
		});
	});

	describe('#prepend()', function(){
		it('should add an item to the beginning of the collection', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			expect(collection.prepend(0)).to.equal(6);
			expect(collection.all()).to.deep.equal([0, 1, 2, 3, 4, 5]);
		});
	});

	describe('#pull()', function(){
		it('should remove and returns an item from the collection by its key', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			expect(collection.pull(2)).to.equal(3);
			expect(collection.all()).to.deep.equal([1, 2, 4, 5]);
		});
	});

	describe('#push()', function(){
		it('should append an item to the end of the collection', function(){
			var collection = collect([1, 2, 3, 4]);

			expect(collection.push(5)).to.equal(5);
			expect(collection.all()).to.deep.equal([1, 2, 3, 4, 5]);
		});
	});

	describe('#random()', function(){
		it('should return a random item from the collection', function(){
			var collection = collect([1, 2, 3, 4, 5, 6, 7]);
			var random = collection.random();

			expect(collection.contains(random)).to.be.true;
		});

		it('should return n random items from the collection', function(){
			var collection = collect([1, 2, 3, 4, 5, 6, 7]);
			var random = collection.random(3).all();

			expect(random.length).to.equal(3);
		});
	});

	describe('#reduce()', function(){
		it('should reduce the collection to a single value', function(){
			var collection = collect([1, 2, 3]);

			var total = collection.reduce(function(carry, item){
				return carry + item;
			});

			expect(total).to.equal(6);
		});

		it('should reduce the collection to a single value, given a initial value', function(){
			var collection = collect([1, 2, 3]);

			var total = collection.reduce(function(carry, item){
				return carry + item;
			}, 4);

			expect(total).to.equal(10);
		});
	});

	describe('#reject()', function(){
		it('should remove the collection using the given callback', function(){
			var collection = collect([1, 2, 3, 4]);

			var filtered = collection.reject(function(value, key){
				return value > 2;
			});

			expect(filtered.all()).to.deep.equal([1, 2]);
		});
	});

	describe('#reverse()', function(){
		it('should reverse the order of the items in the collection', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			var reversed = collection.reverse();

			expect(reversed.all()).to.deep.equal([5, 4, 3, 2, 1]);
		});
	});

	describe('#search()', function(){
		it('should search the collection for the given value and returns its key if found', function(){
			var collection = collect([2, 4, 6, 8]);

			expect(collection.search(4)).to.equal(1);
		});

		it('should search the collection in strict mode', function(){
			var collection = collect([2, 4, 6, 8]);

			expect(collection.search('4')).to.equal(1);
			expect(collection.search('4', true)).to.be.false;
		});

		it('should search the collection given a callback', function(){
			var collection = collect([2, 4, 6, 8]);

			expect(collection.search(function(item){
				return item > 5;
			})).to.equal(2);
		});
	});

	describe('#shift()', function(){
		it('should remove and returns the first item from the collection', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			expect(collection.shift()).to.equal(1);
			expect(collection.all()).to.deep.equal([2, 3, 4, 5]);
		});
	});

	describe('#shuffle()', function(){
		it('should randomly shuffle the items in the collection', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			var shuffled = collection.shuffle();

			expect(shuffled.all()).to.have.length(collection.count());
		});
	});

	describe('#slice()', function(){
		it('should return a slice of the collection starting at the given index', function(){
			var collection = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

			var slice = collection.slice(4);

			expect(slice.all()).to.deep.equal([5, 6, 7, 8, 9, 10]);
		});

		it('should slice the collection by a give index and limit', function(){
			var collection = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

			var slice = collection.slice(4, 2);

			expect(slice.all()).to.deep.equal([5, 6]);
		});
	});

	describe('#sort()', function(){
		it('should sort the collection', function(){
			var collection = collect([5, 3, 1, 2, 4]);

			var sorted = collection.sort();

			expect(sorted.all()).to.deep.equal([1, 2, 3, 4, 5]);
		});
	});

	describe('#sortBy()', function(){
		it('should sort the collection by a given key', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Wardrobe', price: 800, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' }
			]);

			var sorted = collection.sortBy('price');

			expect(sorted.all()).to.deep.equal([
				{ product: 'Chair', price: 100, color: 'green' },
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Wardrobe', price: 800, color: 'blue' }
			]);
		});

		it('should sort the collection by a given callback', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, colors: ['Black', 'Mahogany'] },
				{ product: 'Wardrobe', price: 800, colors: ['Black'] },
				{ product: 'Chair', price: 100, colors: ['Red', 'Beige', 'Brown'] }
			]);

			var sorted = collection.sortBy(function(item, key){
				return item.colors.length;
			});

			expect(sorted.all()).to.deep.equal([
				{ product: 'Wardrobe', price: 800, colors: ['Black'] },
				{ product: 'Desk', price: 200, colors: ['Black', 'Mahogany'] },
				{ product: 'Chair', price: 100, colors: ['Red', 'Beige', 'Brown'] }
			]);
		});
	});

	describe('#sortByDesc()', function(){
		it('should sort the collection by a given key', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Wardrobe', price: 800, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' }
			]);

			var sorted = collection.sortByDesc('price');

			expect(sorted.all()).to.deep.equal([
				{ product: 'Wardrobe', price: 800, color: 'blue' },
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' }
			]);
		});

		it('should sort the collection by a given callback', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, colors: ['Black', 'Mahogany'] },
				{ product: 'Wardrobe', price: 800, colors: ['Black'] },
				{ product: 'Chair', price: 100, colors: ['Red', 'Beige', 'Brown'] }
			]);

			var sorted = collection.sortByDesc(function(item, key){
				return item.colors.length;
			});

			expect(sorted.all()).to.deep.equal([
				{ product: 'Chair', price: 100, colors: ['Red', 'Beige', 'Brown'] },
				{ product: 'Desk', price: 200, colors: ['Black', 'Mahogany'] },
				{ product: 'Wardrobe', price: 800, colors: ['Black'] }
			]);
		});
	});

	describe('#splice()', function(){
		it('should remove and return a slice of items starting at a given index', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			var chunk = collection.splice(2);

			expect(chunk.all()).to.deep.equal([3, 4, 5]);
			expect(collection.all()).to.deep.equal([1, 2]);
		});

		it('should remove and return a slice of items starting at a given index and limit', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			var chunk = collection.splice(2, 1);

			expect(chunk.all()).to.deep.equal([3]);
			expect(collection.all()).to.deep.equal([1, 2, 4, 5]);
		});

		it('should remove, return a slice of items starting at a given index and replace them by a given array', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			var chunk = collection.splice(2, 1, [10, 11]);

			expect(chunk.all()).to.deep.equal([3]);
			expect(collection.all()).to.deep.equal([1, 2, 10, 11, 4, 5]);
		});
	});

	describe('#sum()', function(){
		it('should return the sum of all items in the collection', function(){
			expect(collect([1, 2, 3, 4, 5]).sum()).to.equal(15);
		});

		it('should return the sum of all items in the collection by a given key', function(){
			var collection = collect([
				{name: 'JavaScript: The Good Parts', pages: 176},
				{name: 'JavaScript: The Definitive Guide', pages: 1096}
			]);

			expect(collection.sum('pages')).to.equal(1272);
		});

		it('should return the sum of all items in the collection by a given callback', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, colors: ['Black', 'Mahogany'] },
				{ product: 'Wardrobe', price: 800, colors: ['Black'] },
				{ product: 'Chair', price: 100, colors: ['Red', 'Beige', 'Brown'] }
			]);

			expect(collection.sum(function(item, index){
				return item.colors.length;
			})).to.equal(6);
		});
	});

	describe('#take()', function(){
		it('should return a new collection with a specified number of items', function(){
			var collection = collect([0, 1, 2, 3, 4, 5]);

			var chunk = collection.take(3);

			expect(chunk.all()).to.deep.equal([0, 1, 2]);
		});

		it('should return a new collection with a specified number of items by a negative index', function(){
			var collection = collect([0, 1, 2, 3, 4, 5]);

			var chunk = collection.take(-2);

			expect(chunk.all()).to.deep.equal([4, 5]);
		});
	});

	describe('#toString()', function(){
		it('should stringify the collection', function(){
			var collection = collect([0, 1, 2, 3, 4, 5]);

			expect(collection.toString()).to.equal('[0,1,2,3,4,5]');
			expect(`${collection}`).to.equal('[0,1,2,3,4,5]');
		});
	});

	describe('#transform()', function(){
		it('should iterate each item and transform them by a given callback', function(){
			var collection = collect([1, 2, 3, 4, 5]);

			collection.transform(function(item, key){
				return item * 2;
			});

			expect(collection.all()).to.deep.equal([2, 4, 6, 8, 10]);
		});

		it('should iterate each item and transform them by a given callback', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, colors: ['Black', 'Mahogany'] },
				{ product: 'Wardrobe', price: 800, colors: ['Black'] },
				{ product: 'Chair', price: 100, colors: ['Red', 'Beige', 'Brown'] }
			]);

			collection.transform(function(item, key){
				item.colorCount = item.colors.length;

				return item;
			});

			expect(collection.all()).to.deep.equal([
				{ product: 'Desk', price: 200, colors: ['Black', 'Mahogany'], colorCount: 2 },
				{ product: 'Wardrobe', price: 800, colors: ['Black'], colorCount: 1 },
				{ product: 'Chair', price: 100, colors: ['Red', 'Beige', 'Brown'], colorCount: 3 }
			]);
		});
	});

	describe('#union()', function(){
		it('should adds the given array to the collection', function(){
			var collection = collect([
				{name: 'iPhone 6', brand: 'Apple', type: 'phone'},
				{name: 'iPhone 5', brand: 'Apple', type: 'phone'},
				{name: 'Apple Watch', brand: 'Apple', type: 'watch'}
			]);

			var union = collection.union([
				{name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
				{name: 'iPhone 5', brand: 'Apple', type: 'phone'},
				{name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'}
			]);

			expect(union.all()).to.deep.equal([
				{name: 'iPhone 6', brand: 'Apple', type: 'phone'},
				{name: 'iPhone 5', brand: 'Apple', type: 'phone'},
				{name: 'Apple Watch', brand: 'Apple', type: 'watch'},
				{name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
				{name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'}
			]);
		});
	});

	describe('#unique()', function(){
		it('should return all of the unique value in the collection', function(){
			var collection = collect([1, 1, 2, 2, 3, 4, 2]);

			var unique = collection.unique();

			expect(unique.all()).to.deep.equal([1, 2, 3, 4]);
		});

		it('should return all of the unique value in the collection by a given key', function(){
			var collection = collect([
				{name: 'iPhone 6', brand: 'Apple', type: 'phone'},
				{name: 'iPhone 5', brand: 'Apple', type: 'phone'},
				{name: 'Apple Watch', brand: 'Apple', type: 'watch'},
				{name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
				{name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'}
			]);

			var unique = collection.unique('brand');

			expect(unique.all()).to.deep.equal([
				{name: 'iPhone 6', brand: 'Apple', type: 'phone'},
				{name: 'Galaxy S6', brand: 'Samsung', type: 'phone'}
			]);
		});

		it('should return all of the unique value in the collection by a given callback', function(){
			var collection = collect([
				{name: 'iPhone 6', brand: 'Apple', type: 'phone'},
				{name: 'iPhone 5', brand: 'Apple', type: 'phone'},
				{name: 'Apple Watch', brand: 'Apple', type: 'watch'},
				{name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
				{name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'}
			]);

			var unique = collection.unique(function(item){
				return item.brand + item.type;
			});

			expect(unique.all()).to.deep.equal([
				{name: 'iPhone 6', brand: 'Apple', type: 'phone'},
				{name: 'Apple Watch', brand: 'Apple', type: 'watch'},
				{name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
				{name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'}
			]);
		});
	});

	describe('#values()', function(){
		it('should return a new collection with the keys reset', function(){
			var collection = collect([1, , , 3, , 4, 2]);

			expect(collection.values().all()).to.deep.equal([1, 3, 4, 2]);
		});
	});

	describe('#where()', function(){
		it('should filter the collection by a given key / value pair', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Wardrobe', price: 100, color: 'blue' },
				{ product: 'Door', price: 150, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' }
			]);

			var filtered = collection.where('price', 100);

			expect(filtered.all()).to.deep.equal([
				{ product: 'Wardrobe', price: 100, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' }
			]);
		});

		it('should filter the collection by a given key / value pair and operator', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Wardrobe', price: 100, color: 'blue' },
				{ product: 'Door', price: 150, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' }
			]);

			var filtered = collection.where('price', '>', 100);

			expect(filtered.all()).to.deep.equal([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Door', price: 150, color: 'blue' }
			]);
		});

		it('should filter the collection by a given key / value pair and like operator', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Wardrobe', price: 100, color: 'blue' },
				{ product: 'Door', price: 150, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' },
				{ product: 'Charizard', price: Infinity, color: 'red' }
			]);

			var filtered = collection.where('product', 'like', 'Cha');

			expect(filtered.all()).to.deep.equal([
				{ product: 'Chair', price: 100, color: 'green' },
				{ product: 'Charizard', price: Infinity, color: 'red' }
			]);
		});
	});

	describe('#whereStrict()', function(){
		it('should filter the collection by a given key / value pair in strict mode', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Wardrobe', price: '100', color: 'blue' },
				{ product: 'Door', price: 150, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' }
			]);

			var filtered = collection.whereStrict('price', 100);

			expect(filtered.all()).to.deep.equal([
				{ product: 'Chair', price: 100, color: 'green' }
			]);
		});
	});

	describe('#whereIn()', function(){
		it('should filter the collection by a given key and values in array', function(){
			var collection = collect([
				{ product: 'Desk', price: 200, color: 'blue' },
				{ product: 'Wardrobe', price: 100, color: 'red' },
				{ product: 'Door', price: 150, color: 'blue' },
				{ product: 'Chair', price: 100, color: 'green' }
			]);

			var filtered = collection.whereIn('color', ['green', 'red']);

			expect(filtered.all()).to.deep.equal([
				{ product: 'Wardrobe', price: 100, color: 'red' },
				{ product: 'Chair', price: 100, color: 'green' }
			]);
		});
	});

	describe('#whereDate()', function(){
		it('should filter the collection by a given key date pair', function(){
			var collection = collect([
				{ name: 'Charmander', color: 'red', captured: new Date('2016-09-19') },
				{ name: 'Squirtle', color: 'blue', captured: new Date('2016-09-20') },
				{ name: 'Bulbasaur', color: 'green', captured: new Date('2016-09-23') },
				{ name: 'Pikachu', color: 'yellow', captured: new Date('2016-09-19') }
			]);

			var filtered = collection.whereDate('captured', new Date('2016-09-19'));

			expect(filtered.all()).to.deep.equal([
				{ name: 'Charmander', color: 'red', captured: new Date('2016-09-19') },
				{ name: 'Pikachu', color: 'yellow', captured: new Date('2016-09-19') }
			]);
		});
	});

	describe('#whereDateBetween()', function(){
		it('should filter the collection between two dates', function(){
			var collection = collect([
				{ name: 'Charmander', color: 'red', captured: new Date('2016-09-19') },
				{ name: 'Squirtle', color: 'blue', captured: new Date('2016-09-20') },
				{ name: 'Bulbasaur', color: 'green', captured: new Date('2016-09-23') },
				{ name: 'Pikachu', color: 'yellow', captured: new Date('2016-09-19') }
			]);

			var filtered = collection.whereDateBetween('captured', new Date('2016-09-18'), new Date('2016-09-21'));

			expect(filtered.all()).to.deep.equal([
				{ name: 'Charmander', color: 'red', captured: new Date('2016-09-19') },
				{ name: 'Squirtle', color: 'blue', captured: new Date('2016-09-20') },
				{ name: 'Pikachu', color: 'yellow', captured: new Date('2016-09-19') }
			]);
		});
	});

	describe('#zip()', function(){
		it('should merge together the values of the given array', function(){
			var collection = collect(['Chair', 'Desk']);

			var zipped = collection.zip([100, 200]);

			expect(zipped.all()).to.deep.equal([['Chair', 100], ['Desk', 200]]);
		});
	});
});
