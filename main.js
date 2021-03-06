const url = require('url');
const HTTPAgent = require('socks-proxy-agent');
const webSocket = require('socket.io-client');
const grpcSocket = require('nodejs-grpc-socketio-proxy');
const tunnelFactory = require('nodejs-proxy-tcp-tunnel');
module.exports = function (serverAddress, proxyAddress) {
    let self = this;
    let proxyUrl = undefined;
    if (proxyAddress) {
        proxyUrl = url.parse(proxyAddress);
    }
    let serverUrl = undefined;
    if (serverAddress) {
        serverUrl = url.parse(serverAddress);
    }
    // Connects to the Onion Redis queue
    this.connect = function (callback) {
        let socket;
        let configuration = {};
        if ('grpc:' === serverUrl.protocol) {
            if (proxyAddress) {
                let localAddress = '127.0.0.1';
                let localPort = parseInt(serverUrl.port) + 8000;
                self.tunnel = tunnelFactory
                    .from(localAddress, localPort)
                    .through('socks5', proxyUrl.hostname, proxyUrl.port)
                    .to(serverUrl.hostname, serverUrl.port)
                    .start();
                // Change server address to the tunnel
                serverAddress = localAddress + ':' + localPort;
            } else {
                // Remove the protocol prefix
                serverAddress = serverAddress.replace('grpc://', '');
            }
            socket = grpcSocket.ClientSocket;
        } else {
            if (proxyAddress) {
                configuration.agent = new HTTPAgent(proxyAddress);
            }
            socket = webSocket;
        }
        self.connection = socket.connect(serverAddress, configuration);
        self.connection.on('connect', function () {
            // v.1.0
            // Let the tunnel to be initialized
            // setTimeout(function () {
            // }, 3000);
            // v.2.0
            callback();
        });
    };
    this.disconnect = function (callback) {
        if (self.connection) {
            self.connection.disconnect();
            self.connection = undefined;
        }
        if (self.tunnel) {
            self.tunnel.close(callback);
            self.tunnel = undefined;
        } else {
            callback();
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
