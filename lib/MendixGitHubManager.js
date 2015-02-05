/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, DOMParser, ActiveXObject, console, window */

define(function (require, exports, module) {
    'use strict';

    var MODULE_NAME_GITHUB               = 'mendix.wdpforbrackets.github',

        // External managers.
        ProjectManager                  = brackets.getModule('project/ProjectManager'),
        CommandManager                  = brackets.getModule('command/CommandManager'),
        DocumentManager                 = brackets.getModule('document/DocumentManager'),
        KeyEvent                        = brackets.getModule("utils/KeyEvent"),
        EditorManager                   = brackets.getModule('editor/EditorManager'),
        ExtensionUtils                  = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain                      = brackets.getModule("utils/NodeDomain"),
        Dialogs                         = brackets.getModule('widgets/Dialogs'),
        Menus                           = brackets.getModule('command/Menus'),
        FileSystem                      = brackets.getModule('filesystem/FileSystem'),
        FileUtils                       = brackets.getModule('file/FileUtils'),

        GitHubDomain = new NodeDomain("GitHub", ExtensionUtils.getModulePath(module, "../node/GitHub")),

        ExternalIODomain = new NodeDomain("ExternalIO", ExtensionUtils.getModulePath(module, "../node/ExternalIO"));

    var MendixGitHubManager = {

        _template : null,
        _templateName : null,
        _versionNumber : '',
        _authorName : '',
        _nameOfWidget : '',
        _packageOfWidget : '',
        _licenseName : '',
        _copyrightName : '',
        _directoryOfWidget : '',
        _gitHubDialog : null,
        _progressBar : null,
        _progressBarContainer : null,

        setupMenu : function () {

            /**
             * Widget Workshop Options
             */

            // First, register a command - a UI-less object associating an id to a handler
            CommandManager.register('New Widget', MODULE_NAME_GITHUB, MendixGitHubManager.setupGitHub);

            // Create menu item.
            var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
            menu.addMenuDivider();
            menu.addMenuItem(MODULE_NAME_GITHUB, null, Menus.FIRST);

            var file = FileSystem.getFileForPath(require.toUrl('node/github.html')),
                loadFile = FileUtils.readAsText(file);  // completes asynchronously

            // Load the javascript file
            loadFile.done(function (text) {
                MendixGitHubManager._template = text;
            });

        },

        setupGitHub : function () {

            var html = MendixGitHubManager._template,
                htmlJ = null;

            html = html.split('{{title}}').join('Create a new Custom Widget!');
            html = html.split('{{body}}').join('<table><tr><td style="vertical-align: top;padding-right: 10px;"><div class="form-group"><label for="authorName">Author</label><input type="text" class="form-control" id="authorName" placeholder="Name of the author." value="' + MendixGitHubManager._authorName + '"></div><div class="form-group"><label for="licenseName">License name</label><input type="text" class="form-control" id="licenseName" placeholder="License used, example (Apache 2, MIT, etc...)." value="' + MendixGitHubManager._licenseName + '"></div><div class="form-group"><label for="copyrightName">Copyright</label><input type="text" class="form-control" id="copyrightName" placeholder="Copyright used." value="' + MendixGitHubManager._copyrightName + '"></div></td><td><div class="form-group"><label for="versionNumber">Version</label><input type="text" class="form-control" id="versionNumber" placeholder="Version number of the widget." value="' + MendixGitHubManager._versionNumber + '"></div><div class="form-group"><label for="packageOfWidget">PackageName</label><input type="text" class="form-control" id="packageOfWidget" placeholder="PackageName of the custom widget." value="' + MendixGitHubManager._packageOfWidget + '"></div><label for="nameOfWidget">Name</label><input type="text" class="form-control" id="nameOfWidget" placeholder="Name of the custom widget." value="' + MendixGitHubManager._nameOfWidget + '"></div></td></tr><tr><td colspan="2"><div class="form-group"><label for="directoryOfWidget">Location</label><div class="form-inline"><input type="text" class="form-control" id="directoryOfWidget" placeholder="Directory of the custom widget." value="' + MendixGitHubManager._directoryOfWidget + '">&nbsp;<button class="btn primary" id="btnSelectDir">browse</button></div></div></td></tr></table>');

            MendixGitHubManager.showDialog(html);

        },

        showDialog : function (html) {

            var htmlJ = null;

            htmlJ = $(html);

            htmlJ.find('#authorName').on('keyup', function () {
                MendixGitHubManager._authorName = $('#authorName').val();
            });

            htmlJ.find('#versionNumber').on('keyup', function () {
                MendixGitHubManager._versionNumber = $('#versionNumber').val();
            });

            htmlJ.find('#nameOfWidget').on('keyup', function () {
                MendixGitHubManager._nameOfWidget = $('#nameOfWidget').val();
            });

            htmlJ.find('#directoryOfWidget').on('change', function () {
                MendixGitHubManager._directoryOfWidget = $('#directoryOfWidget').val();
            });

            htmlJ.find('#licenseName').on('change', function () {
                MendixGitHubManager._licenseName = $('#licenseName').val();
            });

            htmlJ.find('#copyrightName').on('change', function () {
                MendixGitHubManager._copyrightName = $('#copyrightName').val();
            });

            htmlJ.find('#packageOfWidget').on('change', function () {
                MendixGitHubManager._packageOfWidget = $('#packageOfWidget').val();
            });

            htmlJ.find('#btnSelectDir').on('click', function () {

                FileSystem.showOpenDialog(false, true, 'Where to download and save the new Custom Widget?', null, null, function (err, path) {

                    if (path !== '') {

                        $('#directoryOfWidget').val(path);
                        MendixGitHubManager._directoryOfWidget = path;

                    }

                });

            });

            htmlJ.find('#cloonBoilerplate').on('click', function () {

                var tmpDir = null;

                if (MendixGitHubManager._nameOfWidget === '') {
                    Dialogs.showModalDialog(null, 'Warning', 'You need to have a name for the widget.').done(function () {
                    });
                } else {
                    if (MendixGitHubManager._directoryOfWidget === '') {
                        Dialogs.showModalDialog(null, 'Warning', 'Select a path to clone the widget to.').done(function () {
                        });
                    } else {

                        if (MendixGitHubManager._packageOfWidget === '') {
                            Dialogs.showModalDialog(null, 'Warning', 'You need to have a packagename for the widget.').done(function () {
                            });
                        } else {

                            tmpDir = FileSystem.getDirectoryForPath(MendixGitHubManager._directoryOfWidget + '/' + MendixGitHubManager._packageOfWidget + '/');
                            tmpDir.getContents(function (err, array) {
                                console.log(array);
                                if (array.length > 0) {
                                    Dialogs.showModalDialog(null, 'Error', 'The directory for cloning the "AppStoreWidgetBoilerplate" is not empty.').done(function () {
                                    });
                                } else {
                                    $(MendixGitHubManager._progressBarContainer).removeClass('mx-hidden');
                                    MendixGitHubManager.createClone();
                                }
                            });


                        }

                    }
                }


            });

            MendixGitHubManager._progressBar = htmlJ.find('#progressBar');
            MendixGitHubManager._progressBarContainer = htmlJ.find('#progressBarContainer');

            // Load the javascript file
            MendixGitHubManager._gitHubDialog = Dialogs.showModalDialogUsingTemplate(htmlJ);

        },

        setProgressBar : function (amount) {
            MendixGitHubManager._progressBar.attr('style', 'opacity: 1.0;width: ' + amount + '%;');
            MendixGitHubManager._progressBar.attr('aria-valuenow', amount);
            MendixGitHubManager._progressBar.html(amount + '%');
        },

        createClone : function () {
            console.log('nameOfWidget: ' + MendixGitHubManager._nameOfWidget + ' - directoryOfWidget: ' + MendixGitHubManager._directoryOfWidget);

            MendixGitHubManager.setProgressBar(25);

            GitHubDomain.exec('getUserRepoReleases', 'mendix', 'AppStoreWidgetBoilerplate').done(function (body) {

                MendixGitHubManager.setProgressBar(50);

                var i = 0,
                    repoUrl = '',
                    repoName = null,
                    tagName = null,
                    idRepo = null;

                if (typeof body[0].assets === 'object' && body[0].assets.length > 0 && typeof body[0].assets[0].url !== 'undefined') {
                    repoUrl = body[0].assets[0].url;
                }

                repoName = 'AppStoreWidgetBoilerplate';
                tagName = body[0].tag_name;
                idRepo = body[0].id;

                console.log('[mendix.wdpforbrackets-github-repourl]' + (repoName + '-' + tagName).split('.').join('_') + '.zip');
                console.log('[mendix.wdpforbrackets-github-repourl]' + repoUrl);
                console.log('[mendix.wdpforbrackets-github-_nameOfWidget]' + MendixGitHubManager._nameOfWidget);
                console.log('[mendix.wdpforbrackets-github-_authorName]' + MendixGitHubManager._authorName);
                console.log('[mendix.wdpforbrackets-github-_versionNumber]' + MendixGitHubManager._versionNumber);
                console.log('[mendix.wdpforbrackets-github-_copyrightName]' + MendixGitHubManager._copyrightName);
                console.log('[mendix.wdpforbrackets-github-_licenseName]' + MendixGitHubManager._licenseName);
                console.log('[mendix.wdpforbrackets-github-_packageOfWidget]' + MendixGitHubManager._packageOfWidget);

                var externalIO = ExternalIODomain.exec('getRemoteFile', repoUrl,
                                                       MendixGitHubManager._directoryOfWidget,
                                                       (repoName + '-' + tagName).split('.').join('_') + '.zip',
                                                       MendixGitHubManager._nameOfWidget,
                                                       MendixGitHubManager._authorName,
                                                       MendixGitHubManager._versionNumber,
                                                       MendixGitHubManager._copyrightName,
                                                       MendixGitHubManager._licenseName,
                                                       MendixGitHubManager._packageOfWidget);
                externalIO.done(function () {
                    MendixGitHubManager.setProgressBar(100);
                    Dialogs.showModalDialog(null, 'Information', 'We succesfully cloned the "AppStoreBoilerplate" to the new Custom Widget: "' + MendixGitHubManager._nameOfWidget + '".').done(function () {
                        MendixGitHubManager._gitHubDialog.close();
                        ProjectManager.openProject(MendixGitHubManager._directoryOfWidget + '/' + MendixGitHubManager._packageOfWidget + '/src/').done(function () {
                        });
                    });
                    console.log('[mendix.wdpforbrackets-github] cloned to ' + repoUrl);
                });
                externalIO.fail(function (e) {
                    MendixGitHubManager.setProgressBar(0);
                    Dialogs.showModalDialog(null, 'Error', 'We could not clone the AppStoreBoilerplate.\n' + e).done(function () {
                    });
                    console.log('[mendix.wdpforbrackets-github] oh no.. ' + e);
                });

            }).fail(function (err) {
                console.error("[mendix.wdpforbrackets-github-getUser] failed to run GitHub.getUser - ", err);
            });

            console.log('[mendix.wdpforbrackets-github-getUserRepos]');
        }

    };

    module.exports = MendixGitHubManager;
});