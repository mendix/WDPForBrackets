/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, DOMParser, ActiveXObject, console, window */

define(function (require, exports, module) {
    'use strict';

    var MODULE_NAME_CODER               = 'mendix.wdpforbrackets.coder',

        // External managers.
        CommandManager                  = brackets.getModule('command/CommandManager'),
        DocumentManager                 = brackets.getModule('document/DocumentManager'),
        KeyEvent                        = brackets.getModule("utils/KeyEvent"),
        EditorManager                   = brackets.getModule('editor/EditorManager'),

        SnippetsManager                 = require("lib/MendixSnippets"),

        MendixWorkshopManager           = require('lib/MendixWorkshopManager'),

        MendixWorkspaceManager          = require('lib/MendixWorkspaceManager');


    var MendixCodeManager = {


        setupEvents : function () {

            // Readout javascript functions!
            var currentEditor = EditorManager.getCurrentFullEditor();
            $(currentEditor).on('keydown', MendixCodeManager.keyEventHandler);
            $(EditorManager).on('activeEditorChange', MendixCodeManager.activeEditorChangeHandler);

        },

        createSidePanel : function () {
            $('#sidebar').prepend('<div class="working-set-header mendix-title">Mendix</div><div class="mx-properties" id="mx_properties"></div>');
        },

        parseLine : function (line, cursorPosition) {
            var words;
            line = line.substring(0, cursorPosition);
            //split the line in "words" made of alphanumeric char or underscores (a-zA-Z0-9 and _)
            words = line.split(/\W/);
            return words[words.length - 1];
        },

        strcontains : function (text, stringToSearch) {
            if (text.indexOf(stringToSearch) !== -1) {
                return true;
            } else {
                return false;
            }
        },

        readMendixJSFunctions : function () {
            var document = DocumentManager.getCurrentDocument(),
                editor = EditorManager.getCurrentFullEditor(),
                text = document.getText(),
                textContent = document.getText(),
                textPart = '',
                lines = [],
                linePos = 0,
                lastLine = '',
                part = '',
                partTrimmed = '',
                functionNames = [],
                functionContent = [],
                html = '<div class="mx-coder-functions"><ul>',
                arrayObj = [ 'update', 'suspend', 'resume', 'uninitialize', 'postCreate', 'startup' ],
                prop = null,
                val = null,
                i = 0,
                k = 0,
                j = 0;

            $("#mx_properties").html('');

            $(".mendix-title").html('Mendix');

            if (text.indexOf('/*mendix') !== -1) {

                $(".mendix-title").html('Mendix - JavaScript Properties');

                // attempt to get the functions without eval!
                text = text.split('function(').join('{{funcname}}function');
                text = text.split('function (').join('{{funcname}}function');

                lines = text.split('\n');

                for (i = 0; i < lines.length; i++) {
                    part = lines[i].trim();
                    if (MendixCodeManager.strcontains(part, '{{funcname}}')) {
                        linePos = part.indexOf('{{funcname}}');
                        partTrimmed = part.trim();
                        partTrimmed = partTrimmed.split('\t').join('');
                        partTrimmed = partTrimmed.split(' ').join('');
                        if (!MendixCodeManager.strcontains(partTrimmed, "callback:") && !MendixCodeManager.strcontains(partTrimmed, "error:")) {
                            if (MendixCodeManager.strcontains(part, ":")) {
                                part = part.split('{{funcname}}').join('');
                                part = part.trim();
                                part = part.split(':')[0];
                                functionNames.push(part.trim());
                                html += '<li class="mx-coder-func-item" data-search="' + part.trim() + '" data-line="' + i + '" data-line-pos="' + (linePos + 8) + '"><i class="fa fa-file-code-o fa-1"></i> ' + part.trim() + '</li>';
                            }
                        }
                    }
                }

                html += '</ul></div>';

                $('#mx_properties').html(html);

                var getFunctionsInFunctions = function (textContent, pos) {

                };

                for (j = 0; j < functionNames.length; j++) {

                    var posFirst = textContent.indexOf(functionNames[j] + ':'),
                        posSecond = textContent.indexOf(functionNames[j] + ' :');


                    if (posFirst !== -1) {
                        getFunctionsInFunctions(textContent, posFirst);
                    }
                    if (posSecond !== -1) {
                        getFunctionsInFunctions(textContent, posSecond);
                    }

                }

                $('#mx_properties .mx-coder-func-item').each(function (index, node) {
                    $(node).on('click', function () {
                        var line = parseInt($(this).attr('data-line'), 10),
                            ch = parseInt($(this).attr('data-line-pos'), 10);
                        var editor = EditorManager.getCurrentFullEditor();
                        if (editor.getShowActiveLine === false) {
                            editor.setShowActiveLine = true;
                        }
                        editor.focus();
                        editor.setCursorPos(line, ch, true);
                        $('#mx_properties .mx-coder-func-item').removeClass('active');
                        $(this).addClass('active');
                    });
                });
            }



        },

        readMendixPackageXMLFile : function (xmlDoc) {
            var clientModules = xmlDoc.getElementsByTagName("clientModule"),

                // XML readout stuff
                i = null,
                j = null,
                k = null,
                l = null,

                clientModule = null,
                widgetFiles = null,
                widgetFile = null,
                widgetFileEntry = null,

                // Actual values!
                clientModuleName = '',
                clientModuleVersion = '',
                widgetFileNames = [],

                // Html end result
                html = '<div class="mx-coder-functions"><ul>';


            for (i = 0; i < clientModules.length; i++) {
                clientModule = clientModules[0];

                clientModuleName = clientModule.getAttribute('name');
                clientModuleVersion = clientModule.getAttribute('version');

                widgetFiles = clientModule.getElementsByTagName("widgetFiles");
                for (j = 0; j < widgetFiles.length; j++) {
                    widgetFile = widgetFiles[0].getElementsByTagName("widgetFile");

                    for (k = 0; k < widgetFile.length; k++) {
                        widgetFileEntry = widgetFile[k];
                        widgetFileNames.push(widgetFileEntry.getAttribute('path'));
                    }

                }
            }

            $("#mx_properties").html('');

            $(".mendix-title").html('Mendix - package.xml');

            html += '<li class="mx-coder-func-item"> Name: </li>';
            html += '<li class="mx-coder-func-item"><input class="form-control mx-coder-input" type="text" id="clientModuleName" value="' + clientModuleName.trim() + '" placeholder="name of the widget..." /></li>';
            html += '<li class="mx-coder-func-item"> Version: </li>';
            html += '<li class="mx-coder-func-item"><input class="form-control mx-coder-input" type="text" id="clientModuleVersion" value="' + clientModuleVersion.trim() + '" placeholder="version of the widget..." /></li>';

            html += '<li class="mx-coder-func-item"> XML files: </li>';
            for (l = 0; l < widgetFileNames.length; l++) {
                html += '<li class="mx-coder-func-item"><input class="form-control mx-coder-input" type="text" id="widgetFileNames' + l + '" value="' + widgetFileNames[l] + '" placeholder="xml properties file..." /></li>';
            }

            html += '</ul></div>';

            $('#mx_properties').html(html);

        },

        readMendixXMLFile : function () {
            var document = DocumentManager.getCurrentDocument(),
                editor = EditorManager.getCurrentFullEditor(),
                xml = document.getText(),
                parser = null,
                xmlDoc = null,

                packageXml = false,
                widgetXml = false;

            if (window.DOMParser) {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(xml, "text/xml");
            } else {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(xml);
            }

            // Check if we have a package xml file.
            packageXml = xmlDoc.getElementsByTagName("package")[0];

            // Check if we have a widget xml file.
            widgetXml = xmlDoc.getElementsByTagName("widget")[0];

            if (packageXml) {
                MendixCodeManager.readMendixPackageXMLFile(xmlDoc);
            } else if (widgetXml) {
                //for now let's set this to empty.
                //TODO: widget xml readout
                $("#mx_properties").html('');
            }

        },

        fileOpenType : function () {
            var document = DocumentManager.getCurrentDocument(),
                file = document.file,
                fileName = file.fullPath,
                fileParts = [],
                extension = '';

            if (file !== '') {

                fileParts = fileName.split('.');
                extension = fileParts[(fileParts.length - 1)];

                switch (extension) {
                case 'js':
                    MendixCodeManager.readMendixJSFunctions();
                    break;
                case 'xml':
                    MendixCodeManager.readMendixXMLFile();
                    break;
                default:
                }

            }
        },

        keyEventHandler : function ($event, editor, event) {
            var cursorPosition,
                line,
                snippetKey,
                start,
                codeMirror;

            if (event.type === "keydown") {
                MendixCodeManager.fileOpenType();
            }

            if ((event.type === "keydown") && (event.keyCode === KeyEvent.DOM_VK_TAB)) {
                cursorPosition = editor.getCursorPos();
                line = editor.document.getLine(cursorPosition.line);
                snippetKey = MendixCodeManager.parseLine(line, cursorPosition.ch);
                if (SnippetsManager[snippetKey]) {
                    start = {
                        line: cursorPosition.line,
                        ch: cursorPosition.ch - snippetKey.length
                    };
                    editor.document.replaceRange(SnippetsManager[snippetKey], start, cursorPosition);
                    codeMirror = editor._codeMirror;
                    // Re-indent each line of the editor.
                    codeMirror.operation(function () {
                        codeMirror.eachLine(function (line) {
                            codeMirror.indentLine(line.lineNo());
                        });
                    });
                    event.preventDefault();
                }

            }
        },

        activeEditorChangeHandler : function ($event, focusedEditor, lostEditor) {

            if (lostEditor) {
                $(lostEditor).off("keydown", MendixCodeManager.keyEventHandler);
            }

            if (focusedEditor) {
                MendixCodeManager.fileOpenType();
                $(focusedEditor).on("keydown", MendixCodeManager.keyEventHandler);
            }

        }

    };

    module.exports = MendixCodeManager;
});