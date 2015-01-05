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
    function cmdStartMendix(path, callback) {
    
        var exec = require('child_process').execFile;
        var func = function(path){
            var newPath = 'C:/Program Files (x86)/Mendix/Version Selector/VersionSelector.exe --file=' + path + '';
               
            newPath = newPath.split('/').join('\\');
            
            console.log("fun() start");
            console.log(newPath);
            
            exec(newPath, function(err, data) {  
                console.log(err)
                console.log(data.toString());                       
            });  
        }
        func(path);
        
        callback(null, '');
        
    }
    
    /**
     * Initializes the test domain with several test commands.
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init(domainManager) {
        if (!domainManager.hasDomain("MendixCLI")) {
            domainManager.registerDomain("MendixCLI", {major: 0, minor: 1});
        }
        domainManager.registerCommand(
            "MendixCLI",       // domain name
            "startMendix",    // command name
            cmdStartMendix,   // command handler function
            true,          // this command is synchronous in Node
            "Start mendix.",
            [{  name: "path", // parameters
                type: "string",
                description: "The url to pickup the file from."}]
        );
    }
    
    exports.init = init;
    
}());