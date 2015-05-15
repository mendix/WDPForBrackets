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
    function cmdCreateDB(path, callback) {

        console.log('[sqlite - got path]: ' + path);

        try {
            
            var sqe = require('sqe');

            console.log('[sqlite - get lib]');

            var json = {
                "name": "testdb",
                "fields": [
                    {
                        "name": "username",
                        "ftype": "STRING"
                    }
                ]
            };

            console.log('[sqlite - JSON]: ' + json);

            sqe.open(path);

            console.log('[sqlite] open path');

            sqe.createTable(json, function (table) {

                console.log('[sqlite] create table');

                sqe.showTable(json, function () {

                    console.log('[sqlite] show table');

                    sqe.close();
                });
            });
        } catch (e) {
            console.log('[sqlite - error]' + e);
        }

        callback(null, '');

    }

    /**
     * Initializes the MendixSQLite domain with several test commands.
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init(domainManager) {
        if (!domainManager.hasDomain("MendixSQLite")) {
            console.log('Registered: MendixSQLite');
            domainManager.registerDomain("MendixSQLite", {major: 0, minor: 1});
        }
        domainManager.registerCommand(
            "MendixSQLite",         // domain name
            "createDB",             // command name
            cmdCreateDB,            // command handler function
            true,                   // this command is synchronous in Node
            "Create SQLite database.",
            [{  name: "path",       // parameters
                'type': "string",
                description: "The path to save the database."}]
        );
    }

    exports.init = init;

}());