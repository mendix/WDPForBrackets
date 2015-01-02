/*global mx, mxui, mendix, dojo, require, console, define, module, document, window */

define([],function(){
    'use strict';
    
    return function() {

        var WebFontConfig = {
            google: { families: [ 'Gloria+Hallelujah::latin' ] }
        },

        _loadFont = function() {

            var wf = document.createElement('script'),
                s = null;
            
            wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
                '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);

            // Global unique variable to not set the font again in the body!
            window.__loadedGoogleFontGloriaHallelyjah = true;

        };

        return {

            loadFont : _loadFont

        };

    };

});