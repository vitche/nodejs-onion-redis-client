module.exports = {
	testPublish: function (test) {
		var configuration = require('../configuration');
		var OnionRedisClient = require("..");
		var publisher = new OnionRedisClient(configuration.namespace, configuration.proxy.address, configuration.transport);
		publisher.connect(function (error) {
			if (undefined !== error) {
				console.log(error);
				return;
			}
			publisher.on('data', function (data) {
				test.done();
			});
			publisher.publish('test', ':)');
		});
	},
	testSubscribe: function (test) {
		var configuration = require('../configuration');
		var OnionRedisClient = require("..");
		var listener = new OnionRedisClient(configuration.namespace, configuration.proxy.address, configuration.transport);
		var publisher = new OnionRedisClient(configuration.namespace, configuration.proxy.address, configuration.transport);
		listener.connect(function (error) {
			var subscribed = false;
			if (undefined !== error) {
				console.log(error);
				return;
			}
			listener.on('data', function (data) {
				subscribed = true;
			});
			listener.on('message', function (message) {
				test.ok(subscribed && ':)' === message.message, 'should get a transmitted message');
				test.done();
			});
			listener.subscribe('test');
			publisher.connect(function (error) {
				if (undefined !== error) {
					console.log(error);
					return;
				}
				publisher.publish('test', ':)');
			});
		});
	}
};