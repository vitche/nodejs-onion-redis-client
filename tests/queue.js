var configuration = require('../configuration');
var onionRedisClient = require("..");
var proxyAddress = 'socks://127.0.0.1:9050';
var namespaceOnionUri = configuration.namespace;
module.exports = {
    testPublish: function (test) {
        var publisher = new onionRedisClient(proxyAddress, namespaceOnionUri);
        publisher.connect(function (error) {
            if (undefined != error) {
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
        var listener = new onionRedisClient(proxyAddress, namespaceOnionUri);
        var publisher = new onionRedisClient(proxyAddress, namespaceOnionUri);
        listener.connect(function (error) {
            var subscribed = false;
            if (undefined != error) {
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
                if (undefined != error) {
                    console.log(error);
                    return;
                }
                publisher.publish('test', ':)');
            });
        });
    }
};