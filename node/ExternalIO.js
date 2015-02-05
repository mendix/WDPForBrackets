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
    function _downloadAndUnzip(fs, request, local, filename, widgetName, author, version, copyright, license, packagename, zip, url, sysPath, callbackToBeginning) {
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

        fs.readdir(local, function (err, files) {
            if (err) {
                throw err;
            }
            if (files.length > 0) {
                throw 'the directory is not empty';
            }
            request(options).pipe(fs.createWriteStream(local + '/' + filename)).on('finish', function () {
                console.log('ExternalIO - file - ' + local + '/' + filename + ' - was downloaded!');
                zip.unzip(local + '/' + filename, local, function () {
                    fs.unlink(local + '/' + filename);
                    console.log('ExternalIO - file unlinked - ' + local + '/' + filename);
                    console.log('ExternalIO - unpacked file - ' + local);
                    console.log('ExternalIO - rename - ' + local + '/src/WidgetName/' + ' - to - ' + local + '/src/' + widgetName + '/');

                    // OK! ... it can be possible to have a template with a WidgetName as a directory and a PackageName as a directory.
                    // This should be determained.

                    fs.exists(local + '/src/WidgetName/', function (exists) {

                        var packageNameDirChk = 'WidgetName',
                            packageNameDir = 'WidgetName';

                        if (exists) {
                            packageNameDirChk = 'WidgetName';
                            packageNameDir = widgetName;
                        } else {
                            packageNameDirChk = 'PackageName';
                            packageNameDir = packagename;
                        }

                        // Rename 'src/WidgetName'
                        fs.rename(local + '/src/' + packageNameDirChk + '/', local + '/src/' + packageNameDir + '/', function (err) {
                            if (err) {
                                throw err;
                            }

                            console.log('ExternalIO - rename - ' + local + '/src/' + packageNameDir + '/WidgetName.xml' + ' - to - ' + local + '/src/' + packageNameDir + '/' + widgetName + '.xml');
                            // Rename 'src/WidgetName/WidgetName.xml'
                            fs.rename(local + '/src/' + packageNameDir + '/WidgetName.xml', local + '/src/' + packageNameDir + '/' + widgetName + '.xml', function (err) {
                                if (err) {
                                    throw err;
                                }

                                console.log('ExternalIO - rename - ' + local + '/src/' + packageNameDir + '/widget/WidgetName.js' + ' - to - ' + local + '/src/' + packageNameDir + '/widget/' + widgetName + '.js');
                                // Rename 'src/WidgetName/widget/WidgetName.js'
                                fs.rename(local + '/src/' + packageNameDir + '/widget/WidgetName.js', local + '/src/' + packageNameDir + '/widget/' + widgetName + '.js', function (err) {
                                    if (err) {
                                        throw err;
                                    }

                                    console.log('ExternalIO - rename - ' + local + '/src/' + packageNameDir + '/widget/ui/WidgetName.css' + ' - to - ' + local + '/src/' + packageNameDir + '/widget/ui/' + widgetName + '.css');

                                    // Rename 'src/WidgetName/widget/ui/WidgetName.css'
                                    fs.rename(local + '/src/' + packageNameDir + '/widget/ui/WidgetName.css', local + '/src/' + packageNameDir + '/widget/ui/' + widgetName + '.css', function (err) {
                                        if (err) {
                                            throw err;
                                        }

                                        // We need to know if the templates directory exists.
                                        fs.exists(local + '/src/' + packageNameDir + '/widget/templates', function (exists) {

                                            var templateDir = 'templates';

                                            if (exists) {
                                                templateDir = 'templates';
                                            } else {
                                                templateDir = 'template';
                                            }


                                            console.log('ExternalIO - rename - ' + local + '/src/' + packageNameDir + '/widget/' + templateDir + '/WidgetName.html' + ' - to - ' + local + '/src/' + packageNameDir + '/widget/' + templateDir + '/' + widgetName + '.html');

                                            // Rename 'src/WidgetName/widget/templates/WidgetName.css'
                                            fs.rename(local + '/src/' + packageNameDir + '/widget/' + templateDir + '/WidgetName.html', local + '/src/' + packageNameDir + '/widget/' + templateDir + '/' + widgetName + '.html', function (err) {
                                                if (err) {
                                                    throw err;
                                                }

                                                // Change 'src/WidgetName/WidgetName.xml'
                                                var editFile = function (path, args, callback) {

                                                    console.log('ExternalIO - alter file - ' + path + ' - rename WidgetName to ' + widgetName);
                                                    fs.readFile(path, 'utf8', function (err, data) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                        var d = new Date();
                                                        data = data.split('WidgetName').join(args.widgetName);
                                                        data = data.split('widgetname').join(args.widgetName.toLowerCase());
                                                        data = data.split('{{author}}').join(args.author);
                                                        data = data.split('{{date}}').join(d.toUTCString());
                                                        data = data.split('{{version}}').join(args.version);
                                                        data = data.split('{{copyright}}').join(args.copyright);
                                                        data = data.split('{{license}}').join(args.license);
                                                        data = data.split('{{packagename}}').join(args.packagename);
                                                        fs.unlink(path, function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                            fs.writeFile(path, data, function (err) {
                                                                if (err) {
                                                                    throw err;
                                                                }
                                                                callback();
                                                            });
                                                        });
                                                    });
                                                };

                                                var argumentsObj = {
                                                    widgetName: widgetName,
                                                    author: author,
                                                    version: version,
                                                    copyright: copyright,
                                                    license: license,
                                                    packagename: packagename
                                                };

                                                editFile(local + '/src/package.xml', argumentsObj, function () {

                                                    editFile(local + '/src/' + packageNameDir + '/' + widgetName + '.xml', argumentsObj, function () {

                                                        editFile(local + '/src/' + packageNameDir + '/widget/' + widgetName + '.js', argumentsObj, function () {

                                                            editFile(local + '/src/' + packageNameDir + '/widget/ui/' + widgetName + '.css', argumentsObj, function () {

                                                                editFile(local + '/src/' + packageNameDir + '/widget/' +  templateDir + '/' + widgetName + '.html', argumentsObj, function () {

                                                                    console.log('We execute that we are done...');
                                                                    // Renamed all and voila truly done..
                                                                    callbackToBeginning();

                                                                });

                                                            });

                                                        });

                                                    });
                                                });

                                            });


                                        });

                                    });

                                });

                            });


                        });


                    });

                });
            });

        });

    }

    function cmdGetRemoteFile(url, local, filename, widgetName, author, version, copyright, license, packagename, callback) {

        var directory = null,
            fs = require('fs'),
            zip = require('bauer-zip'),
            sysPath = process.cwd(),
            request = require('request');

        console.log('ExternalIO - download url: ' + url);
        console.log('ExternalIO - save to local: ' + local);
        console.log('ExternalIO - file: ' + filename);

        local = local + '/' + packagename + '/';

        fs.exists(local, function (exists) {
            if (!exists) {
                fs.mkdirSync(local);
            }
        
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
                        _downloadAndUnzip(fs, request, local, filename, widgetName, author, version, copyright, license, packagename, zip, url, sysPath, callback);
                    });
                } else {
                    console.log('ExternalIO - file does not exists: ' + filename);
                    console.log('ExternalIO - try to download to new file stream: ' + url + ' - ' + filename);
                    _downloadAndUnzip(fs, request, local, filename, widgetName, author, version, copyright, license, packagename, zip, url, sysPath, callback);
                }
            });

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