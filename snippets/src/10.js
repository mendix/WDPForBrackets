_isEven : function isEven(n) {
                return  (n%2 === 0);
            },
            
            // Create notes on the interface
            _renderReminderNotesResult : function(obj){

                // Variables
                var $ = this.$,
                    templateNote = dojo.cache( 'ReminderNotes.widget.templates', 'ReminderNote.html' ),
                    functionsToExecute = [],
                    objsWithUsers = [],
                    i = 0,
                    renderNote = null;

                if(obj){

                    // Collect notes!
                    functionsToExecute = [];
                    objsWithUsers = [];
                    
                    // We do not create a function inside a loop, but outside.
                    renderNote = function(obj, i, callback) {

                        mx.data.action({
                            params          : {
                                applyto     : 'selection',
                                actionname  : this.mfToGetReminderGetCurrentUser,
                                guids       : [obj.getGuid()]
                            },
                            callback        : lang.hitch(this, function( obj, i, callback, mxObj ) {

                                var handle = mx.data.subscribe({
                                    guid     : obj.getGuid(),
                                    callback : lang.hitch(this, function( objInfo, guid) {

                                        var $ = this.$,
                                            template = null,
                                            title = null,
                                            description = null;

                                        // Do nothing if we are saving ourselfs!
                                        if(this._doNotUpdate === true) {

                                            // Set to editible again for outer alteration!
                                            this._doNotUpdate = false;

                                        } else {

                                            // The object info is send to the internal function.
                                            template = this._refreshNote( objInfo , 1);

                                            // Render the new template
                                            title = $('#' + this.id + ' .mx-note.data-mx-note-' + this.mxform.id + '-' + objInfo.id + ' input[class=title]');
                                            description = $('#' + this.id + ' .mx-note.data-mx-note-' + this.mxform.id + '-' + objInfo.id + ' textarea[class=mainText]');

                                            title.val( objInfo.obj.get(this.reminderNoteTitle) );
                                            description.val( objInfo.obj.get(this.reminderNoteDescription) );

                                        }


                                    }, { obj: obj, user: mxObj[0], id: i } )
                                });

                                // Objects with a user that are related to the note.
                                objsWithUsers.push({ obj: obj, user: mxObj[0], id: i, subscribed: handle });

                                // Do callback
                                if (typeof callback !== '') {
                                    callback();
                                }

                            }, obj, i, callback )

                        }, this); 

                    };

                    // Create mx collect object
                    for(i = 0; i < obj.length; i++){

                        // Check the entire notes list if the note is on this page
                        if(obj[i].get(this.reminderNotePage) === this.mxform.getTitle()){

                            // Anonymous function to get the users.
                            functionsToExecute.push( lang.hitch(this, renderNote, obj[i], i));

                        }

                    }

                    // Exectue functions and collect the end result!
                    mendix.lang.collect(functionsToExecute, function(){

                        // We may not drag and drop notes that are not from a certain user.
                        this._remimderNotes = objsWithUsers;

                        // Create HTML of posible
                        var html = '',
                            $ = this.$,
                            mxwx = this._mxwx,
                            newTemplateNote = '',
                            i = 0;

                        for (i = 0; i < objsWithUsers.length; ++i) {

                            // The object info is send to the internal function.
                            newTemplateNote = this._refreshNote( objsWithUsers[i], i );

                            // Render to end result.
                            html += newTemplateNote;

                        }
                        if(html !== ''){

                            // Append the newly created HTML.
                            $(this.domNode).append(html);

                            // Setup draggable events for newly created HTML elements.
                            this._setupEvents();
                        }

                    },this);

                }

            },