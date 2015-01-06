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
            
            GitHubDomain.exec('getUserRepos', 'mendix').done(function (body) {
                var html = MendixGitHubManager._template,
                    htmlRes = '<ul class="">',
                    i = null;
                
                for (i in body) {
                    if (body.hasOwnProperty(i)) {
                        var repo = body[i];
                        htmlRes += '<li class="mx-github-repo-item" data-repo-name="' + repo.name + '"><table><tr><td class="mx-github-avatar"><img src="' + repo.owner.avatar_url + '" width="32" height="32"></td><td class="mx-github-repo" data-repo-user="mendix" data-repo-name="' + repo.name + '"><b>' + repo.name + '</b><br>' + repo.description + '</td></tr></table></li>';
                    }
                }
                
                htmlRes += '</ul>';
                html = html.split('{{body}}').join(htmlRes);
                html = html.split('{{title}}').join('Mendix Github Repositories');
                
                html = $(html);
                html.find('.mx-github-repo-item').each(function (index, item) {

                    $(item).on('click', function () {

                        var repoName = $(this).attr('data-repo-name');
                        
                        GitHubDomain.exec('getUserRepoReleases', 'mendix', repoName).done(function (body) {

                            var htmlResult = MendixGitHubManager._template,
                                htmlReleases = $('<ul class=""></ul>'),
                                i = 0;

                            console.log(body);
                            
                            for (i = 0; i < body.length; i++) {
                                htmlReleases.append('<li class="mx-repo-release" data-repo-release-url="' + body[i].zipball_url + '" data-repo-name="' + repoName + '">' + repoName + ' - ' + body[i].name + '</li>');
                            }
                            
                            htmlResult = htmlResult.split('{{body}}').join(htmlReleases.html());
                            htmlResult = htmlResult.split('{{title}}').join('Releases for ' + repoName);
                            htmlResult = $(htmlResult);
                            
                            htmlResult.find('.mx-repo-release').each(function (index, item) {

                                $(item).on('click', function () {
                                    
                                    var repoUrl = $(this).attr('data-repo-release-url'),
                                        repoName = $(this).attr('data-repo-name');
                                    
                                    FileSystem.showSaveDialog('Copy Release: ' + $(item).html(), 'c:', repoName + '.clone', function (err, path) {
                                        
                                        if (path !== '') {
                                            
                                            var newPath = path.split('/');
                                            newPath.pop();
                                            newPath = newPath.join('/');
                                            newPath += '/' + repoName + '.zip';
                                            repoUrl = repoUrl.split('https').join('http');
                                            console.log('[mendix.codesnippets-github-repourl]' + newPath);
                                            console.log('[mendix.codesnippets-github-repourl]' + repoUrl);
                                            
                                            var externalIO = ExternalIODomain.exec('getRemoteFile', repoUrl, newPath);
                                            externalIO.done(function () {
                                                console.log('[mendix.codesnippets-github] cloned to ' + newPath);
                                            });
                                            externalIO.fail(function (e) {
                                                console.log('[mendix.codesnippets-github] oh no.. ' + e);
                                            });
                                            
                                        }
                                        
                                    });
                                    
                                    
                                });
                                
                            });
                            
                            Dialogs.showModalDialogUsingTemplate(htmlResult).done(function (dialog) {
                            });

                        }).fail(function (err) {
                            console.error("[mendix.codesnippets-github-getUser] failed to run GitHub.getUser - ", err);
                        });

                    });

                });

                Dialogs.showModalDialogUsingTemplate(html).done(function (dialog) {
                });
                
                console.log('[mendix.codesnippets-github-getUserRepos]');
                
            }).fail(function (err) {
                console.error("[mendix.codesnippets-github-getUser] failed to run GitHub.getUser - ", err);
            });
            
        }
    
    };
    
    module.exports = MendixGitHubManager;
});