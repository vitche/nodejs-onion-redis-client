# Node.js Onion Redis Client
Onion Redis Client is a solution for connecting to Onion Redis servers through TOR.
Can be used within local network when proxy URI is not specified.

## Message Queue API
The following operations are supported:
 - connect - establish a TOR connection and connect to a server instance;
 - subscribe - subscribe to the given channel;
 - publish - publish a message to the given channel.

The following events can be fired for an established connection:

 - data - fired when a connection status changes;
 - message - fired when a message is received on a subscribed channel.

## Sample Code
To publish a message to the given channel:
```sh
var publisher = new onionRedisClient(uri, proxyAddress);
publisher.connect(function (error) {
    if (undefined != error) {
        console.log(error);
        return;
    }
    publisher.on('data', function (data) {
        console.log(data);
    });
    publisher.publish('test', ':)');
});
```
To subscribe to a given channel and catch a test published message:
```sh
var listener = new onionRedisClient(uri, proxyAddress);
var publisher = new onionRedisClient(uri, proxyAddress);
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
        console.log(message);
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
```
