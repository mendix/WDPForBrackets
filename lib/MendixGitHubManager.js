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

        GitHubDomain = new NodeDomain("GitHub", ExtensionUtils.getModulePath(module, "../node/GitHub"));

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
                
                for(i in body){
                    if (body.hasOwnProperty(i)){
                        var repo = body[i];
                        htmlRes += '<li class=""><table><tr><td class="mx-github-avatar"><img src="' + repo.owner.avatar_url + '" width="32" height="32"></td><td class="mx-github-repo" data-repo-user="mendix" data-repo-name="' + repo.name + '"><b>' + repo.name + '</b><br>' + repo.description + '</td></tr></table></li>'; 
                    }
                }
                
                htmlRes += '</ul>';
                html = html.split('{{body}}').join(htmlRes);
                
                $('.mx-github-repo').on('click', function(){
                    
                    GitHubDomain.exec('getUserRepoReleases', 'mendix', 'AppStoreWidgetBoilerplate').done(function (body) {
                    }).fail(function (err) {
                        console.error("[mendix.codesnippets-github-getUser] failed to run GitHub.getUser - ", err);
                    });
                    
                });
                
                var promise = Dialogs.showModalDialogUsingTemplate(html).done(function (dialog) { });
                
                console.log('[mendix.codesnippets-github-getUserRepos]');
                
            }).fail(function (err) {
                console.error("[mendix.codesnippets-github-getUser] failed to run GitHub.getUser - ", err);
            });
            
        }
    
    };
    
    module.exports = MendixGitHubManager;
});