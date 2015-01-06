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
        
        try {
            /*var http = require('http');
            var fs = require('fs');

            console.log('ExternalIO - download url: ' + url);
            console.log('ExternalIO - save to local: ' + local);

            var file = fs.createWriteStream(local);
            var request = http.get(url, function (response) {
                response.pipe(file);
                file.on('finish', function () {
                    file.close(callback(null, 'ExternalIO - Its done...'));
                });
            });*/
            
            var http = require('http'),
                fs = require('fs'),
                request = require('request'),
                out = fs.createWriteStream(local); // For saving NSE Equity bhavcopy

            // Downloading NSE Bhavcopy
            var req = request(
                {
                    method: 'GET',
                    uri: url,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11",
                        "Referer": "http://www.nseindia.com/products/content/all_daily_reports.htm",
                        "Accept-Encoding": "gzip,deflate,sdch",
                        "encoding": "null",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Cookie": "cookie"
                    }
                }
            );

            req.pipe(out);
            req.on('end', function() {
            });
            fs.on('finish', function () {
                fs.close(callback(null, 'ExternalIO - Its done...'));
            });
            
        } catch (e) {
            console.log('ExternalIO - oopps something goes terribly wrong: ' + e.message);
            callback(e.message, 'ExternalIO - Its done...');
        }
        
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
            [{ name: "url", type: "string", description: "The url to pickup the file from."}, { name: "local", type: "string", description: "The local file to save to."}]
        );
    }
    
    exports.init = init;
    
}());