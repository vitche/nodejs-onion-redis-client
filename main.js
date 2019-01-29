var HTTPAgent = require('socks-proxy-agent');
var webSocket = require('socket.io-client');
var grpcSocket = require('nodejs-grpc-socketio-proxy');
module.exports = function (uri, proxyAddress, transport) {
	var self = this;
	if (!transport) {
		transport = 'grpc';
	}
	// Connects to the Onion Redis queue
	this.connect = function (callback) {
		var socket;
		var configuration = {};
		if (proxyAddress) {
			configuration.agent = new HTTPAgent(proxyAddress);
		}
		socket = 'grpc' === transport ? grpcSocket.ClientSocket : webSocket;
		self.connection = socket.connect(uri, configuration);
		self.connection.on('connect', function () {
			callback();
		});
	};
	this.disconnect = function () {
		if (undefined !== self.connection) {
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
