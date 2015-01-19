/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */
(function () {
    "use strict";
    
    var github = require("octonode");
        
    /**
     * @private
     * Handler function for the simple.getMemory command.
     * @param {boolean} total If true, return total memory; if false, return free memory only.
     * @return {number} The amount of memory.
     */
    function cmdGetUser(userName, callback) {
        
        var client = github.client();
        client.get('/users/' + userName, {}, function (err, status, body, headers) {
            if (err !== null) {
                callback(err, status);
            } else {
                callback(null, body);
            }
        });
        
    }
    
    function cmdGetUserRepos(userName, callback) {
        
        var client = github.client();
        client.get('/users/' + userName + '/repos', {}, function (err, status, body, headers) {
            if (err !== null) {
                callback(err, status);
            } else {
                callback(null, body);
            }
        });
        
    }
    
    function cmdGetUserRepoReleases(userName, repository, callback) {
        
        var client = github.client();
        client.get('/repos/' + userName + '/' + repository + '/releases', {}, function (err, status, body, headers) {
            if (err !== null) {
                callback(err, status);
            } else {
                callback(null, body);
            }
        });
        
    }
    
    function cmdGetUserRepoRelease(userName, repository, release, callback) {
        
        var client = github.client();
        client.get('/repos/' + userName + '/' + repository + '/releases/' + release, {}, function (err, status, body, headers) {
            if (err !== null) {
                callback(err, status);
            } else {
                callback(null, body);
            }
        });
        
    }
    
    
    /**
     * Initializes the test domain with several test commands.
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init(domainManager) {
        if (!domainManager.hasDomain("GitHub")) {
            domainManager.registerDomain("GitHub", {major: 0, minor: 1});
        }
        domainManager.registerCommand(
            "GitHub",       // domain name
            "getUser",    // command name
            cmdGetUser,   // command handler function
            true,          // this command is synchronous in Node
            "Returns the github user",
            [{ name: "userName", type: "string", description: "The username."}, {name: "body", type: "object", description: "JSON structure of the user."}]
        );
        domainManager.registerCommand(
            "GitHub",       // domain name
            "getUserRepos",    // command name
            cmdGetUserRepos,   // command handler function
            true,          // this command is synchronous in Node
            "Returns the github user repos",
            [{ name: "userName", type: "string", description: "The username."}, {name: "body", type: "object", description: "JSON structure of the user's public repositories."}]
        );
        domainManager.registerCommand(
            "GitHub",       // domain name
            "getUserRepoReleases",    // command name
            cmdGetUserRepoReleases,   // command handler function
            true,          // this command is synchronous in Node
            "Returns the github releases",
            [{ name: "userName", type: "string", description: "The username." }, { name: "repository", type: "string", description: "The repository name." }, {name: "memory", type: "number", description: "JSON structure of the user's public repository releases"}]
        );
        domainManager.registerCommand(
            "GitHub",       // domain name
            "getUserRepoRelease",    // command name
            cmdGetUserRepoRelease,   // command handler function
            true,          // this command is synchronous in Node
            "Returns the github releases",
            [{ name: "userName", type: "string", description: "The username." }, { name: "repository", type: "string", description: "The repository name." }, { name: "release", type: "string", description: "The release name." }, {name: "memory", type: "number", description: "JSON structure of the user's public repository releases"}]
        );
    }
    
    exports.init = init;
    
}());