var patch = require('nodejs-patch');
// Patch the "engine.io-client" module
patch.file('./node_modules/engine.io-client/lib/socket.js', './patches/engine.io-client/lib/socket.js.diff', function (error, result) {
    if (error) {
        throw error;
    }
    if (result) {
        console.log('Patched "engine.io-client/lib/socket.js"');
    } else {
        console.log('Not patched "engine.io-client/lib/socket.js" (either success or error, or updated version)');
    }
});
