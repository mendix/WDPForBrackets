/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, DOMParser, ActiveXObject, console, window */

define(function (require, exports, module) {
    'use strict';

    var MODULE_NAME_CODER = 'mendix.wdpforbrackets.coder',

        // External managers.
        CommandManager                  = brackets.getModule('command/CommandManager'),
        DocumentManager                 = brackets.getModule('document/DocumentManager'),
        KeyEvent                        = brackets.getModule("utils/KeyEvent"),
        EditorManager                   = brackets.getModule('editor/EditorManager'),
        FileSystem                      = brackets.getModule('filesystem/FileSystem'),
        

        SnippetsManager = require("lib/MendixSnippets");


    var MendixCodeManager = {


        setupEvents: function () {

            // Readout javascript functions!
            var currentEditor = EditorManager.getCurrentFullEditor();
            $(currentEditor).on('keydown', MendixCodeManager.keyEventHandler);
            $(EditorManager).on('activeEditorChange', MendixCodeManager.activeEditorChangeHandler);

        },

        createSidePanel: function () {
            $('#sidebar').prepend('<div class="working-set-header mendix-title">Mendix</div><div class="mx-properties" id="mx_properties"></div>');
        },

        parseLine: function (line, cursorPosition) {
            var words;
            line = line.substring(0, cursorPosition);
            //split the line in "words" made of alphanumeric char or underscores (a-zA-Z0-9 and _)
            words = line.split(/\W/);
            return words[words.length - 1];
        },

        strcontains: function (text, stringToSearch) {
            if (text.indexOf(stringToSearch) !== -1) {
                return true;
            } else {
                return false;
            }
        },

        readMendixJSFunctions: function () {
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
                arrayObj = ['update', 'suspend', 'resume', 'uninitialize', 'postCreate', 'startup'],
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

        attachEvents: function (xmlDoc, data) {
            var folderString = null,
                pathString = null,
                xmlFileString = null,
                widgetFiles = null,
                widgetFileElement = null,
                document = DocumentManager.getCurrentDocument();
            
            $(".widgetFileAdd").on("click", function (e) {
                e.stopPropagation();
                //Open a dialog to select new widget files to add to the package xml
                FileSystem.showOpenDialog(true, false, 'Which XML file should be added', data.widgetFolder, null, function (err, path) {
                    folderString = data.widgetFolder + '/'
                    pathString = path + '';
                    xmlFileString = pathString.replace(folderString, '');
                    
                    $('#mx_properties .xmlfiles').after('<li class="mx-coder-func-item">' + xmlFileString + '</li>');
                    
                    widgetFileElement = xmlDoc.createElement("widgetFile");
                    widgetFileElement.setAttribute("path", xmlFileString);
                    widgetFiles = xmlDoc.getElementsByTagName("widgetFiles")[0];
                    widgetFiles.appendChild(widgetFileElement);
                    
                    document.setText(new XMLSerializer().serializeToString(xmlDoc));
                })
            });

        },

        buildPackageXMLPanel: function (xmlDoc, data) {
            // Html end result
            var html = '<div class="mx-coder-functions"><ul>',
                l = null;

            $(".mendix-title").html('Mendix - package.xml');


            html += '<li class="mx-coder-func-item"> Name: </li>';
            html += '<li class="mx-coder-func-item"><input class="form-control mx-coder-input" type="text" id="clientModuleName" value="' + data.clientModuleName.trim() + '" placeholder="name of the widget..." /></li>';
            html += '<li class="mx-coder-func-item"> Version: </li>';
            html += '<li class="mx-coder-func-item"><input class="form-control mx-coder-input" type="text" id="clientModuleVersion" value="' + data.clientModuleVersion.trim() + '" placeholder="version of the widget..." /></li>';

            html += '<li class="mx-coder-func-item xmlfiles"> XML files: </li>';
            for (l = 0; l < data.widgetFileNames.length; l++) {
                html += '<li class="mx-coder-func-item">' + data.widgetFileNames[l] + '</li>';
            }
            html += '<li class="mx-coder-func-item"><input class="form-control mx-coder-input widgetFileAdd" type="button" value="add"/></li>'

            html += '</ul></div>';

            $('#mx_properties').html(html);
            MendixCodeManager.attachEvents(xmlDoc, data);
        },

        changePackageXML: function (xmlDoc, data) {
            var document = DocumentManager.getCurrentDocument();
            $('#mx_properties .mx-coder-func-item input').each(function (index, inputNode) {
                $(inputNode).on('blur', function () {
                    //TODO: clean this up?
                    if (this.id.indexOf('clientModuleName') > -1) {
                        if (this.value.trim() !== data.clientModuleName.trim()) {
                            data.clientModule.setAttribute('name', this.value.trim());
                        }
                    } else if (this.id.indexOf('clientModuleVersion') > -1) {
                        if (this.value.trim() !== data.clientModuleVersion.trim()) {
                            data.clientModule.setAttribute('version', this.value.trim());
                        }
                    }
                    //refresh the text in the editor.
                    document.setText(new XMLSerializer().serializeToString(xmlDoc));
                });
            });
        },

        readMendixPackageXMLFile: function (xmlDoc, file) {
            var clientModules = xmlDoc.getElementsByTagName("clientModule"),

                // XML readout stuff
                i = null,
                j = null,
                k = null,

                clientModule = null,
                widgetFiles = null,
                widgetFile = null,
                widgetFileEntry = null,
                
                filePath = file.fullPath,
                widgetFolder = null,

                // Actual values!
                clientModuleName = '',
                clientModuleVersion = '',
                widgetFileNames = [],
                data = {};
            
            widgetFolder = filePath.replace('/package.xml', '');
            
            
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

            data = {
                'clientModule': clientModule,
                'clientModuleName': clientModuleName,
                'clientModuleVersion': clientModuleVersion,
                'widgetFileNames': widgetFileNames,
                'widgetFolder': widgetFolder
            };

            MendixCodeManager.buildPackageXMLPanel(xmlDoc, data);
            MendixCodeManager.changePackageXML(xmlDoc, data);
        },
        readMendixXMLFile: function () {
            var document = DocumentManager.getCurrentDocument(),
                editor = EditorManager.getCurrentFullEditor(),
                xml = document.getText(),
                file = document.file,
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
                MendixCodeManager.readMendixPackageXMLFile(xmlDoc, file);
            } else if (widgetXml) {
                //for now let's set this to empty.
                //TODO: widget xml readout
                $("#mx_properties").html('');
            }

        },

        fileOpenType: function () {
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

        keyEventHandler: function ($event, editor, event) {
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

        activeEditorChangeHandler: function ($event, focusedEditor, lostEditor) {

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