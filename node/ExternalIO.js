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
    function _downloadAndUnzip(fs, request, local, filename, unzip, url) {
        var headers = {
            'User-Agent':       'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
            'accept'    :       'application/octet-stream'
        };

        // Configure the request
        var options = {
            uri: url,
            method: 'GET',
            headers: headers,
            followRedirect: true,
            gzip: true
        };

        console.log('ExternalIO - options - ' + JSON.stringify(options));
        console.log('ExternalIO - started downloading - ' + local + '/' + filename);
        
        request(options).pipe(fs.createWriteStream(local + '/' + filename)).on('finish', function () {
            console.log('ExternalIO - file - ' + local + '/' + filename + ' - was downloaded!');
            fs.createReadStream(local + '/' + filename).pipe(unzip.Extract({ path: local })).on('finish', function () {
                fs.unlink(local + '/' + filename);
                console.log('ExternalIO - file unlinked - ' + local + '/' + filename);
                console.log('ExternalIO - unpacked file - ' + local);
            });
        });
    }

    function cmdGetRemoteFile(url, local, filename, callback) {

        var directory = null,
            fs = require('fs'),
            unzip = require('unzip'),
            sysPath = process.cwd(),
            request = require('request');

        console.log('ExternalIO - download url: ' + url);
        console.log('ExternalIO - save to local: ' + local);
        console.log('ExternalIO - file: ' + filename);
        console.log('ExternalIO - system path: ' + process.cwd());
        console.log('ExternalIO - try change process dir. ' + local);

        process.chdir(local);

        console.log('ExternalIO - try file exists: ' + filename);
        fs.exists(local + '/' + filename, function (exists) {
            if (exists) {
                console.log('ExternalIO - file exists: ' + filename);
                fs.unlink(local + '/' + filename, function (err) {
                    if (err) {
                        console.log('ExternalIO - file unlink error: ' + filename);
                        throw err;
                    }
                    console.log('ExternalIO - try to download to new file stream: ' + url + ' - ' + filename);

                    _downloadAndUnzip(fs, request, local, filename, unzip, url);

                    console.log('ExternalIO - try change process dir back to original. ' + sysPath);
                    process.chdir(sysPath);
                });
            } else {
                console.log('ExternalIO - file does not exists: ' + filename);
                console.log('ExternalIO - try to download to new file stream: ' + url + ' - ' + filename);

                _downloadAndUnzip(fs, request, local, filename, unzip, url);

                console.log('ExternalIO - try change process dir back to original. ' + sysPath);
                process.chdir(sysPath);
            }
        });

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