/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global mx, mxui, mendix, dojo, declare, console, define, module, window, jQuery, document */
/*mendix */
/*

	ReminderNotes
	========================

	@file      : ReminderNotes.js
	@version   : 1.0
	@author    : Gerhard Richard Edens
	@date      : Tuesday, November 18, 2014
	@copyright : Mendix Technology BV
	@license   : Apache License, Version 2.0, January 2004

	Documentation
    ========================
	Describe your widget here.

*/

define([

    // Widget base and template
    'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',

    // Extra DOJO librarie files
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/on', 'dojo/_base/lang', 'dojo/_base/declare',

    // External libraries
    'ReminderNotes/widget/lib/ReminderNotesAssists', 'ReminderNotes/widget/lib/jquery',

    // Load templates
    'dojo/text!ReminderNotes/widget/templates/ReminderNotes.html',
    'dojo/text!ReminderNotes/widget/templates/ReminderSidebar.html',
    'dojo/text!ReminderNotes/widget/templates/ReminderNote.html',

    // Not needed inside widget but must be loaded
    'ReminderNotes/widget/lib/GoogleFont'

], function (_WidgetBase, _TemplatedMixin,

              // Dojo and mendix 
              mxuiDom, dojoDom, dojoQuery, dojoDomProp, dojoDomGeometry, dojoDomClass, dojoDomStyle, on, lang, declare,

              // External libraries
              MxWidgetAssist, _jQuery,

              // Templates
              _templateReminderNotes,
              _templateReminderSidebar,
              _templateReminderNote) {

    // Defining use strict at the top of the widget.
    'use strict';

    // Getting jQuery globally inside the widget.
    var $ = jQuery.noConflict(true),
        mxwx = new MxWidgetAssist();

    // Declaring the new widget.
    return declare('ReminderNotes.widget.ReminderNotes', [ _WidgetBase, _TemplatedMixin ], {

        

    });

});
