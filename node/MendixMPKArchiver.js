/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */
(function () {
    "use strict";
     
    /**
     * @private
     * Handler function for the simple.getMemory command.
     * @param {boolean} total If true, return total memory; if false, return free memory only.
     * @return {number} The amount of memory.
     */
    function cmdCreateMPK(widgetName, source, destination, callback) {

        try {
            
            var file_system = require('fs');
            var archiver = require('archiver');

            var output = file_system.createWriteStream(destination + '/' + widgetName + '.mpk');
            var archive = archiver('zip');

            output.on('close', function () {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
            });

            archive.on('error', function(err){
                throw err;
            });

            archive.pipe(output);
            archive.bulk([
                { expand: true, cwd: source, src: ['**'], dest: ''}
            ]);
            archive.finalize();

            callback(null, 'we are done');
            
        } catch(e) {
            
            callback(e, 'we are not done');
            
        }
    }
    
    /**
     * Initializes the test domain with several test commands.
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init(domainManager) {
        if (!domainManager.hasDomain("MendixMPKArchiver")) {
            domainManager.registerDomain("MendixMPKArchiver", {major: 0, minor: 1});
        }
        domainManager.registerCommand(
            "MPKArchiver",       // domain name
            "createMPK",    // command name
            cmdCreateMPK,   // command handler function
            true,          // this command is synchronous in Node
            "Creates an MPK from a directory.",
            [{  name: "widgetName", // return values
                type: "string",
                description: "The name of the widget."},
             {  name: "pathFrom", // parameters
                type: "string",
                description: "The source directory path to start zipping."},
             {  name: "pathTo", // return values
                type: "string",
                description: "The destination directory path to place the endresult."}]
        );
    }
    
    exports.init = init;
    
}());