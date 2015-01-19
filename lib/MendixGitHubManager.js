/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, DOMParser, ActiveXObject, console, window */

define(function (require, exports, module) {
    'use strict';

    var MODULE_NAME_GITHUB               = 'mendix.github',

        // External managers.
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

            GitHubDomain.exec('getUserRepoReleases', 'mendix', 'AppStoreWidgetBoilerplate').done(function (body) {

                var htmlResult = MendixGitHubManager._template,
                    htmlReleases = $('<ul class=""></ul>'),
                    i = 0,
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

                FileSystem.showOpenDialog(false, true, 'Copy Release: ' + repoName + ' - ' + tagName, null, null, function (err, path) {

                    if (path !== '') {

                        console.log('[mendix.codesnippets-github-repourl]' + (repoName + '-' + tagName).split('.').join('_') + '.zip');
                        console.log('[mendix.codesnippets-github-repourl]' + repoUrl);

                        var externalIO = ExternalIODomain.exec('getRemoteFile', repoUrl, path[0], (repoName + '-' + tagName).split('.').join('_') + '.zip');
                        externalIO.done(function () {
                            console.log('[mendix.codesnippets-github] cloned to ' + repoUrl);
                        });
                        externalIO.fail(function (e) {
                            console.log('[mendix.codesnippets-github] oh no.. ' + e);
                        });

                    }

                });

            }).fail(function (err) {
                console.error("[mendix.codesnippets-github-getUser] failed to run GitHub.getUser - ", err);
            });
            console.log('[mendix.codesnippets-github-getUserRepos]');

        }
        
    };

    module.exports = MendixGitHubManager;
});