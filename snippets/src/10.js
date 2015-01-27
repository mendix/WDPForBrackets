_isEven : function isEven(n) {
            return (n % 2 === 0);
        },

        // We do not create a function inside a loop, but outside.
        _renderNote : function (note, i, notesWithUsers, callback) {

            mx.data.action({
                params          : {
                    applyto     : 'selection',
                    actionname  : this.mfToGetReminderGetCurrentUser,
                    guids       : [note.getGuid()]
                },
                callback        : lang.hitch(this, function (note, i, callback, userObj) {

                    this.subscribe({
                        guid     : note.getGuid(),
                        callback : lang.hitch(this, function (noteWithUser, guid) {

                            var template = null,
                                title = null,
                                description = null;

                            // Do nothing if we are saving ourselfs!
                            if (this._doNotUpdate === true) {

                                // Set to editible again for outer alteration!
                                this._doNotUpdate = false;

                            } else {

                                // The object info is send to the internal function.
                                template = this._refreshNote(noteWithUser, 1);

                                // Render the new template
                                title = $('#' + this.id + ' .mx-note.data-mx-note-' + this.mxform.id + '-' + noteWithUser.id + ' input[class=title]');
                                description = $('#' + this.id + ' .mx-note.data-mx-note-' + this.mxform.id + '-' + noteWithUser.id + ' textarea[class=mainText]');

                                title.val(noteWithUser.note.get(this.reminderNoteTitle));
                                description.val(noteWithUser.note.get(this.reminderNoteDescription));

                            }


                        }, { note: note, user: userObj[0], id: i })
                    });

                    // Objects with a user that are related to the note.
                    notesWithUsers.push({ note: note, user: userObj[0], id: i, subscribed: null });

                    // Do callback
                    if (typeof callback !== 'undefined') {
                        callback();
                    }

                }, note, i, callback)

            }, this);

        },

        // Create notes on the interface
        _renderReminderNotesResult : function (notes) {

            // Variables
            var templateNote = _templateReminderNote,
                functionsToExecute = [],
                notesWithUsers = [],
                i = 0,
                renderNote = null;

            if (notes) {

                // Collect notes!
                functionsToExecute = [];
                notesWithUsers = [];


                // Create mx collect object
                for (i = 0; i < notes.length; i++) {

                    // Check the entire notes list if the note is on this page
                    if (notes[i].get(this.reminderNotePage) === this.mxform.getTitle()) {

                        // Anonymous function to get the users.
                        functionsToExecute.push(lang.hitch(this, this._renderNote, notes[i], i, notesWithUsers));

                    }

                }

                // Exectue functions and collect the end result!
                mendix.lang.collect(functionsToExecute, function () {

                    // We may not drag and drop notes that are not from a certain user.
                    this._reminderNotes = notesWithUsers;

                    // Create HTML of posible
                    var html = '',
                        newTemplateNote = '',
                        i = 0;

                    for (i = 0; i < notesWithUsers.length; ++i) {

                        // The object info is send to the internal function.
                        newTemplateNote = this._refreshNote(notesWithUsers[i], i);

                        // Render to end result.
                        html += newTemplateNote;

                    }
                    if (html !== '') {

                        // Append the newly created HTML.
                        $(this.domNode).append(html);

                        // Setup draggable events for newly created HTML elements.
                        this._setupEvents();
                    }

                }, this);

            }

        },