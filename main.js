var httpAgent = require('socks-proxy-agent');
var webSocket = require('socket.io-client');
module.exports = function (uri, proxyAddress) {
    var self = this;
    // Connects to the Onion Redis queue
    this.connect = function (callback) {
        var configuration = {};
        if (proxyAddress) {
            configuration.agent = new httpAgent(proxyAddress);
        }
        self.connection = webSocket.connect(uri, configuration);
        self.connection.on('connect', function () {
            callback();
        });
    };
    this.disconnect = function () {
        if (undefined != self.connection) {
            self.connection.disconnect();
        }
    };
    this.publish = function (channel, message) {
        self.connection.emit('publish', {
            channel: channel,
            message: message
        });
    };
    this.subscribe = function (channel) {
        self.connection.emit('subscribe', {
            channel: channel
        });
    };
    this.on = function (eventName, callback) {
        self.connection.on(eventName, callback);
    };
    return this;
};
