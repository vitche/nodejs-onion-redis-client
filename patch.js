var patch = require('nodejs-patch');
var cwd = process.cwd();
var relativePath = '/engine.io-client/lib/socket.js';
var path = cwd + '/node_modules' + relativePath;
var fs = require('fs');
if (!fs.existsSync(path)) {
    path = '..' + relativePath;
}
// Patch the "engine.io-client" module
patch.file(path, './patches/engine.io-client/lib/socket.js.diff', function (error, result) {
    if (error) {
        throw error;
    }
    if (result) {
        console.log('Patched "engine.io-client/lib/socket.js"');
    } else {
        console.log('Not patched "engine.io-client/lib/socket.js" (either success or error, or updated version)');
    }
});
