/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, DOMParser, ActiveXObject, window */

define(function (require, exports, module) {
    'use strict';
    
    var MODULE_NAME                     = 'mendix.wdpforbrackets',
        MODULE_NAME_STARTUP             = 'mendix.wdpforbrackets.workshop.startup',
        MODULE_NAME_STARTUP_DIRECT      = 'mendix.wdpforbrackets.workshop.startup.direct',
        MODULE_NAME_MPKARCHIVER         = 'mendix.wdpforbrackets.mpkarchiver',
    
        CommandManager                  = brackets.getModule('command/CommandManager'),
        PreferencesManager              = brackets.getModule('preferences/PreferencesManager'),
        FileSystem                      = brackets.getModule('filesystem/FileSystem'),
        FileUtils                       = brackets.getModule('file/FileUtils'),
        EditorManager                   = brackets.getModule('editor/EditorManager'),
        Dialogs                         = brackets.getModule('widgets/Dialogs'),
        ProjectManager                  = brackets.getModule('project/ProjectManager'),
        NativeApp                       = brackets.getModule('utils/NativeApp'),
        Menus                           = brackets.getModule('command/Menus'),
        ExtensionUtils                  = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain                      = brackets.getModule("utils/NodeDomain"),
        
        ToastrManager                   = require("extension/toastr/toastr.min"),
        
        MendixMPKArchiverDomain = new NodeDomain("MPKArchiver", ExtensionUtils.getModulePath(module, "../node/MendixMPKArchiver"));
        
    var MendixWorkshopManager = {
    
        panel : null,
        prefs : null,
        clientModuleName : null,
        
         /** -------------------------------------
         * Mendix Custom Widget Workshop Software
         */
        
        setupMenu : function () {
            
            var mpkArchiverWindowsCommand = null,
                mpkArchiverMacCommand = null,
                mpkArchiverCommand = null;
            
            // Setup preferences for the WorkshopSnippets.
            MendixWorkshopManager.setupPreferences();
            
            /**
             * Widget Workshop Options
             */

            // First, register a command - a UI-less object associating an id to a handler
            CommandManager.register('Show Mendix Code Snippets', MODULE_NAME, MendixWorkshopManager.showHidePanel);

            // First, register a command - a UI-less object associating an id to a handler
            CommandManager.register('Show Mendix Workshop Startup Screen at startup?', MODULE_NAME_STARTUP, MendixWorkshopManager.showStartupScreen);

            // First, register a command - a UI-less object associating an id to a handler
            CommandManager.register('Show Mendix Workshop Startup Screen', MODULE_NAME_STARTUP_DIRECT, MendixWorkshopManager.showWizard);

            // MPK Archiver.
            mpkArchiverWindowsCommand = {
                key: 'F4',
                platform: 'win'
            };
            mpkArchiverMacCommand = {
                key: 'F4',
                platform: 'mac'
            };
            mpkArchiverCommand = [mpkArchiverWindowsCommand, mpkArchiverMacCommand];
            CommandManager.register('Package Mendix Widget', MODULE_NAME_MPKARCHIVER, MendixWorkshopManager.buildCustomWidget);
            
            // Create menu item.
            var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
            menu.addMenuDivider();
            menu.addMenuItem(MODULE_NAME);
            menu.addMenuDivider();
            menu.addMenuItem(MODULE_NAME_STARTUP);
            menu.addMenuDivider();
            menu.addMenuItem(MODULE_NAME_STARTUP_DIRECT);
            
            var menuEdit = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
            menuEdit.addMenuDivider();
            menuEdit.addMenuItem(MODULE_NAME_MPKARCHIVER, mpkArchiverCommand);
            
            // Add extra button (Sorry not really nice but need to!)
            var buildWidget = $('<img>'),
                buildDiv = $('<div></div>');
            buildDiv.addClass('mx-build');
            buildWidget.attr('src', require.toUrl('img/mendix_build_gray.png'));
            buildWidget.addClass('mx-code-snippets-main');
            buildWidget.on('click', { self: this }, MendixWorkshopManager.buildCustomWidget);
            buildDiv.append(buildWidget);
            $('#main-toolbar .buttons').prepend(buildDiv);

            // Add extra button (Sorry not really nice but need to!)
            var openPanel = $('<img>');
            openPanel.attr('src', require.toUrl('img/mendix.png'));
            openPanel.addClass('mx-code-snippets-main');
            openPanel.on('click', { self: this }, MendixWorkshopManager.showHidePanel);
            $('#main-toolbar .buttons').prepend(openPanel);
            
            // Setup preferences
            if (MendixWorkshopManager.prefs !== null) {
                CommandManager.get(MODULE_NAME_STARTUP).setChecked(MendixWorkshopManager.prefs.get('showGreeting'));
                if (MendixWorkshopManager.prefs.get('showGreeting')) {
                    MendixWorkshopManager.showWizard();
                }
            }
            
        },
        
        setupSnippets : function () {
        
            // Get the snippets
            var file = FileSystem.getFileForPath(require.toUrl('snippets/snippets.json')),
                snippets = FileUtils.readAsText(file);

            snippets.done(function (text) {
                
                var settings = JSON.parse(text),
                    prop = null;

                for (prop in settings) {
                    if (typeof settings[prop] !== 'undefined') {
                        var html = $('<div></div>'),
                            imgSelect = $('<img>'),
                            imgInfo = $('<img>'),
                            imgDiv = $('<div></div>');

                        // Create an HTML snippit.
                        html.addClass('mx-code-snippets-container');

                        imgDiv.addClass('mx-code-snippets-imgdiv');

                        // Create a new clickable image that loads a file and place it in the cursor.
                        imgSelect.attr('src', require.toUrl('img/step1.png'));
                        imgSelect.addClass('mx-code-snippets-hand');
                        imgSelect.attr('data-file', settings[prop].file);
                        imgSelect.on('click', MendixWorkshopManager.insertSnippet);

                        // Image div will contain the img
                        imgDiv.append(imgSelect);

                        // Create info image button.
                        imgInfo.attr('src', require.toUrl('img/info.png'));
                        imgInfo.addClass('mx-code-snippets-hand');
                        imgInfo.attr('data-file', settings[prop].info);
                        imgInfo.on('click', MendixWorkshopManager.showInfo);

                        imgDiv.append(imgInfo);

                        // Image
                        html.append(imgDiv);
                        html.append('<span class="mx-code-snippets-title">' + settings[prop].title + '</span><br>');
                        html.append('<span class="mx-code-snippets-description">' + settings[prop].description + '</span><br>');

                        $('.mx-code-snippets-content-container').append(html);
                    }
                }


            }).fail(function (errorCode) {
                console.log('Error: ' + errorCode);  // one of the FileSystemError constants
            });
        
        },

        setupPreferences : function () {
            
            // Create prefferences
            MendixWorkshopManager.prefs = PreferencesManager.getExtensionPrefs(MODULE_NAME);

            MendixWorkshopManager.prefs.definePreference('showGreeting', 'boolean', false);
            MendixWorkshopManager.prefs.on('change', function () {
                CommandManager.get(MODULE_NAME_STARTUP).setChecked(MendixWorkshopManager.prefs.get('showGreeting'));
            });
            
        
        },

        showHidePanel : function (event) {
            if (MendixWorkshopManager.panel.isVisible()) {
                MendixWorkshopManager.panel.hide();
                CommandManager.get(MODULE_NAME).setChecked(false);
            } else {
                MendixWorkshopManager.panel.show();
                CommandManager.get(MODULE_NAME).setChecked(true);
            }
        },

        showStartupScreen : function () {
            if (CommandManager.get(MODULE_NAME_STARTUP).getChecked()) {
                CommandManager.get(MODULE_NAME_STARTUP).setChecked(false);
            } else {
                CommandManager.get(MODULE_NAME_STARTUP).setChecked(true);
            }
            if (MendixWorkshopManager.prefs !== null) {
                MendixWorkshopManager.prefs.set('showGreeting', CommandManager.get(MODULE_NAME_STARTUP).getChecked());
                MendixWorkshopManager.prefs.save();
            }
        },

        insertSnippet : function (event) {
            var target = event.currentTarget || event.target;
            var fileName = $(target).attr('data-file');
            var file = FileSystem.getFileForPath(require.toUrl("snippets/" + fileName)),
                loadFile = FileUtils.readAsText(file);  // completes asynchronously

            $(target).parent().parent().addClass('mx-code-done');

            // Load the javascript file
            loadFile.done(function (text) {
                console.log('content: ' + text);
                var activeEditor = EditorManager.getActiveEditor();
                activeEditor.focus();
                var editor = EditorManager.getFocusedEditor();
                console.log(editor);
                if (editor) {
                    var insertionPos = editor.getCursorPos();
                    editor.document.replaceRange(text, insertionPos);
                }
            }).fail(function (errorCode) {
                console.log("Error: " + errorCode);  // one of the FileSystemError constants
            });
        },

        /**
         * We are able to automaticly create a wizard from HTML slides with the following functions.
         */
        gotoNextSlide : function (currentWizard, wizardWindows, html, maxWizard) {
            // Increase wizard.
            currentWizard++;

            wizardWindows.each(function (index, node) {
                $(node).removeClass('mx-hidden');
            });
            wizardWindows.each(function (index, node) {
                $(node).addClass('mx-hidden');
            });
            html.find('.mx-wizard-' + currentWizard).removeClass('mx-hidden');

            // At the end?
            if (currentWizard < maxWizard) {
                html.find('.mx-next').removeClass('mx-hidden');
            }
            if (currentWizard === maxWizard) {
                html.find('.mx-next').addClass('mx-hidden');
            }
            if (currentWizard > 0) {
                html.find('.mx-prev').removeClass('mx-hidden');
            }
            return currentWizard;
        },

        gotoPreviousSlide : function (currentWizard, wizardWindows, html, maxWizard) {
            // Increase wizard.
            currentWizard--;
            if (currentWizard === 0) {
                html.find('.mx-prev').addClass('mx-hidden');
            }
            if (currentWizard > 1) {
                html.find('.mx-prev').removeClass('mx-hidden');
            }
            if (currentWizard < maxWizard) {
                html.find('.mx-next').removeClass('mx-hidden');
            }

            wizardWindows.each(function (index, node) {
                $(node).removeClass('mx-hidden');
            });
            wizardWindows.each(function (index, node) {
                $(node).addClass('mx-hidden');
            });
            html.find('.mx-wizard-' + currentWizard).removeClass('mx-hidden');
            return currentWizard;
        },

        showWizard : function (fileName) {
            if (typeof fileName === 'undefined' || fileName === null || fileName === '') {
                fileName = 'wizard/intro.html';
            }
            var file = FileSystem.getFileForPath(require.toUrl('snippets/' + fileName)),
                loadFile = FileUtils.readAsText(file);  // completes asynchronously

            // Load the javascript file
            loadFile.done(function (text) {
                var html = $(text),
                    wizardWindows = html.find('.mx-wizard-window'),
                    currentWizard = 0,
                    maxWizard = (wizardWindows.length - 1);

                html.find('.mx-next').on('click', function (event) {
                    currentWizard = MendixWorkshopManager.gotoNextSlide(currentWizard, wizardWindows, html, maxWizard);
                });

                html.find('.mx-prev').on('click', function (event) {
                    currentWizard = MendixWorkshopManager.gotoPreviousSlide(currentWizard, wizardWindows, html, maxWizard);
                });

                var promise = Dialogs.showModalDialogUsingTemplate(html).done(function (dialog) { });

            }).fail(function (errorCode) {
                console.log('Error: ' + errorCode);  // one of the FileSystemError constants
            });
            
        },

        showInfo : function (event) {
            var target = event.currentTarget || event.target;
            var fileName = $(target).attr('data-file');
            MendixWorkshopManager.showWizard(fileName);
        },

        buildCustomWidget : function (event) {
            var source = ProjectManager.getProjectRoot()._path,
                destination = source.split('src').join('test/widgets');
            
            // Check if the source is a Custom Widget project
            if (source.indexOf('/src') === -1) {
                ToastrManager.error("The directory is not the source directory of a Custom Widget project.");
            } else {
            
                // Get the package XML to get the client module name.
                var file = FileSystem.getFileForPath(require.toUrl(source + '/package.xml')),
                    packageXML = FileUtils.readAsText(file);

                // Once done get the name of the client module.
                packageXML.done(function (xml) {

                    var clientModules = null,
                        clientModule = null,
                        clientModuleName = null,
                        xmlDoc = null,
                        parser = null,
                        i = 0;

                    // Get the XML parser
                    if (window.DOMParser) {
                        parser = new DOMParser();
                        xmlDoc = parser.parseFromString(xml, "text/xml");
                    } else {
                        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async = false;
                        xmlDoc.loadXML(xml);
                    }

                    // Get the client modules
                    clientModules = xmlDoc.getElementsByTagName("clientModule");

                    // Last module wins!
                    for (i = 0; i < clientModules.length; i++) {
                        clientModule = clientModules[0];
                        clientModuleName = clientModule.getAttribute('name');
                    }
                    MendixWorkshopManager.clientModuleName = clientModuleName;

                    console.log('MPK Archiver - clientModule name:' + clientModuleName);
                    console.log('MPK Archiver - created:' + source);
                    console.log('MPK Archiver - destination:' + destination);

                    var result = MendixMPKArchiverDomain.exec('createMPK', clientModuleName, source, destination);
                    result.done(function (body) {
                        ToastrManager.info("You have successfully created a new MPK with the name '" + MendixWorkshopManager.clientModuleName + ".mpk'");
                    });
                    result.fail(function (e) {
                        ToastrManager.error("You could not create a new MPK with the name '" + MendixWorkshopManager.clientModuleName + ".mpk'");
                    });

                });
                
                packageXML.fail(function (e) {
                    ToastrManager.error("There is no package.xml ava liable within the source directory.");
                });
                
            }
        }
        
    };

    module.exports = MendixWorkshopManager;
});
