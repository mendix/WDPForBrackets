/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    'use strict';
    
    var Snippets = {
        
        /**
         * Mendix Client API
         */
        
        '_func' :       ': function () {\n' +
                        '}',
        
        '_if' :         'if () {\n' +
                        '}',
        
        '_ifelse' :     'if () {\n' +
                        '} else {\n' +
                        '}',
        
        mxserverget :   'mx.server.get({\n' +
                        '    url: "",\n' +
                        '    handleAs: "text",\n' +
                        '    load: lang.hitch(this, function(response) {\n' +
                        '        console.log("dogs", response);\n' +
                        '    }),\n' +
                        '    error: lang.hitch(this, function(e) {\n' +
                        '        console.log("failed to retrieve resource");\n' +
                        '    })\n' +
                        '});',
        
        mxaction    :   'mx.data.action({\n' +
                        '    params          : {\n' +
                        '        applyto     : "selection",\n' +
                        '        actionname  : "",\n' +
                        '        guids       : [],\n' +
                        '    },\n' +
                        '    callback        : function(obj) {\n' +
                        '    },\n' +
                        '    error           : function(error) {\n' +
                        '    }\n' +
                        '}, this);\n',
        
        mxactionx    :   'mx.data.action({\n' +
                        '    params          : {\n' +
                        '        applyto     : "set",\n' +
                        '        actionname  : "",\n' +
                        '        xpath       : "//",\n' +
                        '        constraints : "[id = ]",\n' +
                        '    },\n' +
                        '    callback        : function(obj) {\n' +
                        '    }),\n' +
                        '    error           : function(error) {\n' +
                        '    })\n' +
                        '}, this);\n',
        
        mxdata      :   'mx.data.get({\n' +
                        '    guids    : [],\n' +
                        '    callback : function(objs) {\n' +
                        '        console.log("Received " + objs.length + " MxObjects");\n' +
                        '    }\n' +
                        '}, this);\n',
        
        mxcreate    :   'mx.data.create({\n' +
                        '    entity: "",\n' +
                        '    callback: function(obj) {\n' +
                        '        console.log("Object created on server");\n' +
                        '    },\n' +
                        '    error: function(e) {\n' +
                        '        console.log("an error occured: " + e);\n' +
                        '    }\n' +
                        '}, this);\n',
        
        mxsubscribe :   'mx.data.subscribe({\n' +
                        '    guid     : "",\n' +
                        '    callback : lang.hitch(this, function(guid) {\n' +
                        '        logger.log("Object with guid " + guid + " changed");\n' +
                        '    })\n' +
                        '});\n',
        
        /**
         * DOJO Widget Commen Functions
         */
        
        mxun        :   'uninitialize : function() {\n' +
                        '},\n',
        
        mxstart     :   'startup : function() {\n' +
                        '},\n',
        
        mxpost      :   'postCreate : function() {\n' +
                        '},\n',
        
        mxapply     :   'applyContext : function(context, callback) {\n' +
                        '    if (typeof callback !== \'undefined\'){\n' +
                        '        callback();\n' +
                        '    }\n' +
                        '},\n',
        
        mxupdate    :   'update: function (context, callback) {\n' +
                        '    this._dataContent[this.id]._contextObj = context;\n' +
                        '    if (typeof callback !== \'undefined\'){\n' +
                        '        callback();\n' +
                        '    }\n' +
                        '},'

    };
    
    module.exports = Snippets;
});