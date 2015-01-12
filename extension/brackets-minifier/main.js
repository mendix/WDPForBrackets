/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, document, clearTimeout, setTimeout, localStorage */

define(function(require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        FileUtils = brackets.getModule("file/FileUtils"),
        FileSystem = brackets.getModule("filesystem/FileSystem"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        UglifyJS = require("extension/brackets-minifier/vendor/uglifyjs").UglifyJS,
        CSSMin = require("extension/brackets-minifier/vendor/cssmin").CSSMin;

    var language = $("#status-language").text(),
        code = "",
        result = "",
        delay,
        prefs = PreferencesManager.getExtensionPrefs("brackets-minifier");

    // Define preferences
    prefs.definePreference("on-save", "boolean", false);
    prefs.definePreference("js-mangle", "boolean", true);
    prefs.definePreference("js-compress", "boolean", true);

    // Set up indicator
    $("#status-indicators").prepend('<div id="min-status" style="text-align: right;"></div>');
    var tunnel = $("#min-status");

    // Add JSMin
    var uglifyjsPath = require.toUrl("./extension/brackets-minifier/vendor/uglifyjs.js");
    $("body").append("<script src=\"" + uglifyjsPath + "\">");

    function status(msg) {
        tunnel.text(msg);
    }

    function save(code, path) {
        FileSystem.getFileForPath(path).write(code, {});
    }

    function process(editor, lan) {
        var file = editor.document.file;
        if (file.name.match(new RegExp("\\.min\\." + lan))) {
            status("File already minified");
            delay = setTimeout(function() {
                status("");
            }, 1000);
        } else if (lan === "js") {
            var ast = UglifyJS.parse(editor.document.getText());
            ast.figure_out_scope();
            ast.compute_char_frequency();
            if (prefs.get("js-compress"))
                ast = ast.transform(UglifyJS.Compressor());
            if (prefs.get("js-mangle"))
                ast.mangle_names();
            var mini = ast.print_to_string();
            var path = file.fullPath.replace(".js", ".min.js");
            save(mini, path);
            status("Minified");
            delay = setTimeout(function() {
                status("");
            }, 1000);
        } else if (lan === "css") {
            var mini = CSSMin.cssmin(editor.document.getText());
            var path = file.fullPath.replace(".css", ".min.css");
            save(mini, path);
            status("Minified");
            delay = setTimeout(function() {
                status("");
            }, 1000);
        } else {
            status("File type not minifiable");
            delay = setTimeout(function() {
                status("");
            }, 1000);
        }
    }

    // Function to run when the menu item is clicked
    function compile() {
        status("Minifying...");
        language = (EditorManager.getActiveEditor()).document.file.name.split('.').pop();
        if (language !== "js" && language !== "css") {
            status("File type not minifiable");
            delay = setTimeout(function() {
                status("");
            }, 3000);
            return;
        } else {
            code = "";
            var editor = EditorManager.getActiveEditor();
            if (!editor) {
                return;
            }

            process(editor, language);
        }
    }

    $(DocumentManager).on("documentSaved", function(event, doc) {
        if (prefs.get("on-save")) {
            var fExt = doc.file.name.split(".").pop();

            if (fExt === "js" || fExt === "css") {
                compile();
            } else {
                status("File type not minifiable");
            }
        }
    });

    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    var cmd_min_id = "minifier.min";
    var cmd_auto_id = "minifier.auto";
    CommandManager.register("Minify", cmd_min_id, compile);
    CommandManager.register("Minify on Save", cmd_auto_id, function() {
        this.setChecked(!this.getChecked());
    });

    var automaton = CommandManager.get(cmd_auto_id);

    $(automaton).on('checkedStateChange', function() {
        prefs.set("on-save", automaton.getChecked());
    });

    menu.addMenuItem(cmd_min_id, "Ctrl-M");
    menu.addMenuItem(automaton);
    menu.addMenuDivider('before', 'minifier.min');
    contextMenu.addMenuItem(cmd_min_id);

    automaton.setChecked(prefs.get("on-save"));
});