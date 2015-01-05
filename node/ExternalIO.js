/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true */
/*global */
(function () {
    "use strict";
        
    /**
     * @private
     * Handler function for the simple.getMemory command.
     * @param {boolean} total If true, return total memory; if false, return free memory only.
     * @return {number} The amount of memory.
     */
    function cmdGetRemoteFile(url, local, callback) {
        
        var http = require('http');
        var fs = require('fs');

        var file = fs.createWriteStream(local);
        var request = http.get(url, function (response) {
            response.pipe(file);
        });
        
        callback(null, '');
        
    }
    
    /**
     * Initializes the test domain with several test commands.
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init(domainManager) {
        if (!domainManager.hasDomain("ExternalIO")) {
            domainManager.registerDomain("ExternalIO", {major: 0, minor: 1});
        }
        domainManager.registerCommand(
            "ExternalIO",       // domain name
            "getRemoteFile",    // command name
            cmdGetRemoteFile,   // command handler function
            true,          // this command is synchronous in Node
            "Get a file from a HTTP location.",
            [{  name: "url", // parameters
                type: "string",
                description: "The url to pickup the file from."},
             {  name: "local", // return values
                type: "string",
                description: "The local file to save to."}]
        );
    }
    
    exports.init = init;
    
}());