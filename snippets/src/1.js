/*global mx, mxui, mendix, dojo, require, console, define, module */
/**

	ReminderNotes
	========================

	@file      : ReminderNotes.js
	@version   : 1.0
	@author    : ...
	@date      : Tuesday, November 18, 2014
	@copyright : Mendix Technology BV
	@license   : Apache License, Version 2.0, January 2004

	Documentation
    ========================
	Describe your widget here.

*/

(function() {
    'use strict';
    
    // test
    require([

        'mxui/widget/_WidgetBase', 'dijit/_Widget', 'dijit/_TemplatedMixin',
        'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/on', 'dojo/_base/lang', 'dojo/_base/declare', 'dojo/text',
        'ReminderNotes/widget/lib/ReminderNotesAssists', 'ReminderNotes/widget/lib/jquery',
        'ReminderNotes/widget/lib/GoogleFont'

    ], function(_WidgetBase, _Widget, _Templated,
                domMx, dom, domQuery, domProp, domGeom, domClass, domStyle, on, lang, declare, text,
                MxWidgetAssist, _jQuery, _googleFont ) {

        return declare('ReminderNotes.widget.ReminderNotes', [ _WidgetBase, _Widget, _Templated, MxWidgetAssist, _jQuery, _googleFont ], {
        
            
        
        });

    });

}());
