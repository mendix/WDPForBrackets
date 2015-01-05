/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/** Simple extension that adds a "File > Hello World" menu item. Inserts "Hello, world!" at cursor pos. */
define(function (require, exports, module) {
    'use strict';

    // Variables to define the extension.
    var MODULE_NAME                     = 'mendix.codesnippets',
        
        // External managers.
        ExtensionUtils                  = brackets.getModule('utils/ExtensionUtils'),
        AppInit                         = brackets.getModule('utils/AppInit'),
        
        // Third party plugins
        JSBeautify                      = require('extension/beautify/main'),
        CodeFolding                     = require('extension/codefolding/main'),
        JSHint                          = require('extension/jshint/main'),
        
        // Snippets
        MendixGitHubManager             = require('lib/MendixGitHubManager'),
        MendixWorkshopManager           = require('lib/MendixWorkshopManager'),
        MendixCodeManager               = require('lib/MendixCodeManager'),
        MendixWorkspaceManager          = require('lib/MendixWorkspaceManager');
    
    
    // Load CSS
    AppInit.htmlReady(function () {
        
        // Load fonts and then set the rest!
        ExtensionUtils.loadStyleSheet(module, './css/font-awesome.min.css').done(function (index) {
        
            // Load CSS and then set the rest!
            ExtensionUtils.loadStyleSheet(module, './css/main.css').done(function (index) {
                
                // Load CSS and then set the rest!
                ExtensionUtils.loadStyleSheet(module, './extension/toastr/toastr.min.css').done(function (index) {
                
                    // Create the panel.
                    MendixWorkspaceManager.createPanel();

                    /**
                     * Mendix Workshop Manager functions.
                     */
                    MendixWorkshopManager.panel = MendixWorkspaceManager.panel;

                    // Execute workshop manager setup menu.
                    MendixWorkshopManager.setupMenu();

                    // Create the workshop snippets.
                    MendixWorkshopManager.setupSnippets();
                    MendixWorkshopManager.panel.show();

                    /**
                     * Mendix Workspace Manager.
                     */

                    // Handle panel resizing.
                    MendixWorkspaceManager.panelResizer();
                    MendixWorkspaceManager.panelNavigation();

                    // Add the mendix logo at the back of the Brackets
                    MendixWorkspaceManager.alterNoFilePanel();

                    /**
                     * Mendix Code Manager.
                     */

                    // Create code manager!
                    MendixCodeManager.createSidePanel();
                    MendixCodeManager.setupEvents();

                    /**
                     * Mendix GitHub Manager!
                     */
                    MendixGitHubManager.setupMenu();
                
                });

            });
            
        });
        
    });
    
    
});