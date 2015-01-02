/*global mx, mxui, mendix, dojo, require, console, define, module, localStorage */

define([], function() {
     'use strict';
    
     return function() {

         return {

             xpath: (function () {

                 return {

                     getLastAttribute: function (xpath) {

                         var xpathParts = xpath.split('/');

                         return xpathParts[ xpathParts.length - 1 ];

                     },

                     getLastEntity: function (xpath) {

                         var xpathParts = xpath.split('/');
                         xpathParts.pop();

                         return xpathParts[ xpathParts.length - 1 ];

                     },

                     getReference: function (xpath) {

                         var xpathParts = xpath.split('/');

                         return xpathParts[ 0 ];

                     },

                     noAttribute: function (xpath) {

                         var xpathParts = xpath.split('/'),
                            noAttributeXpathPath = null;
                         
                         xpathParts.pop();
                         noAttributeXpathPath = xpathParts.join('/');

                         return noAttributeXpathPath;

                     },

                     noLastEntity: function (xpath) {

                         var xpathParts = xpath.split('/'),
                             noAttributeXpathPath = null;
                         
                         xpathParts.pop();
                         noAttributeXpathPath = xpathParts.join('/');

                         return noAttributeXpathPath;

                     },

                     reverse: function (xpath) {

                         var xpathParts = xpath.split('/'),
                             reverseXpathPath = null;
                         
                         xpathParts.reverse();
                         reverseXpathPath = xpathParts.join('/');

                         return reverseXpathPath;

                     },

                     buildReverseXpath: function (xpath) {

                         var newXpath = '//' + this.getLastEntity(xpath) + '[';

                         newXpath += this.reverse(this.noLastEntity(this.noAttribute(xpath)));

                         newXpath += ' = \'[%CurrentObject%]\']';

                         return newXpath;

                     },

                     replaceCurrentObject: function (xpath, obj) {

                         return xpath.split('[%CurrentObject%]').join(obj.getGuid());

                     }

                 };

             }()),

             array: (function () {

                 return {

                     sort: function (a, b) {

                         if (a[0] < b[0]) {
                             return -1;
                         }
                         if (a[0] > b[0]) {
                             return 1;
                         }

                         return 0;
                     }

                 };

             }()),

             storage: (function () {

                 return {

                     available: function () {
                         if (typeof(Storage) !== "undefined") {
                             return true;
                         } else {
                             return false;
                         }
                     },

                     get: function (key) {
                         return localStorage.getItem(key);
                     },

                     set: function (key, value) {
                         localStorage.setItem(key, value);
                     },

                     split: function (key) {
                         if (localStorage.getItem(key) !== '' && localStorage.getItem(key) !== null && localStorage.getItem(key) !== undefined) {
                             return localStorage.getItem(key).split(',');
                         } else {
                             return [];
                         }
                     },

                     push: function (key, value) {
                         var valueKey = localStorage.getItem(key),
                             valueKeyParts = null;
                         if (valueKey !== '' && valueKey !== null) {
                             valueKeyParts = valueKey.split(',');
                             valueKeyParts.push(value);
                             localStorage.setItem(key, valueKeyParts.join(','));
                         } else {
                             localStorage.setItem(key, value);
                         }
                     },

                     pop: function (key, value) {
                         var valueKey = localStorage.getItem(key),
                             valueKeyParts = null;
                         if (valueKey !== '' && valueKey !== null) {
                             valueKeyParts = valueKey.split(',');
                             valueKeyParts.pop();
                             localStorage.setItem(key, valueKeyParts.join(','));
                         }
                     },

                     add: function (key, value) {
                         var valueKey = localStorage.getItem(key),
                             valueKeyParts = null,
                             item = (key) + '_' + (+new Date());

                         if (valueKey !== '' && valueKey !== null) {
                             valueKeyParts = valueKey.split(',');
                             valueKeyParts.push(item);
                             localStorage.setItem(key, valueKeyParts.join(','));
                             localStorage.setItem(item, value);
                         } else {
                             localStorage.setItem(key, item);
                             localStorage.setItem(item, value);
                         }
                     },

                     remove: function (key, record) {
                         var valueKey = localStorage.getItem(key),
                             valueKeyParts = null,
                             valueKeyString = '',
                             i = 0;

                         if (valueKey !== '' && valueKey !== null) {
                             valueKeyParts = valueKey.split(',');
                             for (i = 0; i < valueKeyParts.length; i++) {
                                 if (valueKeyParts[i] !== record) {
                                     valueKeyString += valueKeyParts[i] + ',';
                                 }
                             }
                             valueKeyString = valueKeyString.substring(0, (valueKeyString.length - 1));
                             localStorage.setItem(key, valueKeyString);
                             localStorage.removeItem(record);
                         }
                     },

                     purge: function (key) {
                         var valueKey = localStorage.getItem(key),
                             valueKeyParts = null,
                             valueKeyString = '',
                             i = 0;

                         if (valueKey !== '' && valueKey !== null) {
                             valueKeyParts = valueKey.split(',');
                             for (i = 0; i < valueKeyParts.length; i++) {
                                 localStorage.removeItem(valueKeyParts[i]);
                             }
                             localStorage.removeItem(key);
                         }
                     },

                     find: function(key, value){
                         var valueKey = localStorage.getItem(key),
                             valueKeyParts = null,
                             valueKeyString = '',
                             i = 0;

                         if (valueKey !== '' && valueKey !== null) {
                             valueKeyParts = valueKey.split(',');
                             for (i = 0; i < valueKeyParts.length; i++) {
                                 if(String(value) === localStorage.getItem(valueKeyParts[i])){
                                    return true;
                                 }
                             }
                             return false;
                         } else {
                             return false;
                         }
                     },

                     findAndRemove: function(key, value){
                         var valueKey = localStorage.getItem(key),
                             valueKeyParts = null,
                             valueKeyString = '',
                             i = 0;

                         if (valueKey !== '' && valueKey !== null) {
                             valueKeyParts = valueKey.split(',');
                             for (i = 0; i < valueKeyParts.length; i++) {
                                 if(String(value) === localStorage.getItem(valueKeyParts[i])){
                                     this.remove(key, valueKeyParts[i]);
                                 }
                             }
                         }
                     }

                 };

             }())

         };
     };

});