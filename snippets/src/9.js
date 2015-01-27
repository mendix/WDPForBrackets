// Create the extra sidebar
        _renderSideBar : function () {
            var sideBar = _templateReminderSidebar;

            $(this.domNode).append(sideBar);

            // Hide or close notes.
            $('#' + this.id + ' .mx-note-sidebar .delete').on('click', lang.hitch(this, function () {

                if (this._activeNote !== null) {

                    var message =   '\r\n"' + this._activeNote.get(this.reminderNoteTitle) + '\r\n\r\n' +
                        this._activeNote.get(this.reminderNoteDescription) + '"';

                    mx.ui.confirmation({
                        content: "Do you really want to delete this note?\r\n" + message,
                        proceed: "OK",
                        cancel: "Cancel",
                        handler: lang.hitch(this, function () {
                            mx.data.action({
                                params: {
                                    applyto: 'selection',
                                    actionname: this.mfToExecuteDeleteForReminderNote,
                                    guids: [this._activeNote.getGuid()]
                                },
                                callback: lang.hitch(this, function (obj) {

                                    // Refresh the data.
                                    this._refreshData();

                                }),
                                error: function (error) {
                                    console.log(error.description);
                                }
                            }, this);
                        })
                    });

                }

            }));

            // Delete the active note!
            $('#' + this.id + ' .mx-note-sidebar .hide').on('click', lang.hitch(this, function () {

                $('#' + this.id + ' .mx-note').each(function (index, node) {
                    $(node).toggleClass('mx-note-hidden');
                });

            }));

            // Create that you can add a note!
            $('#' + this.id + ' .mx-note-sidebar .add').on('click', lang.hitch(this, function () {

                // First create the new mendix object.
                mx.data.create({
                    entity: this.reminderNoteEntity,
                    callback: lang.hitch(this, function (mxObj) {

                        // now lets set its properties
                        mxObj.set(this.reminderNoteTitle, '');
                        mxObj.set(this.reminderNoteDescription, '');
                        mxObj.set(this.reminderNoteDate, new Date());
                        mxObj.set(this.reminderNotePage, this.mxform.getTitle());
                        mxObj.set(this.reminderNoteX, 50);
                        mxObj.set(this.reminderNoteY, 50);
                        mxObj.addReference(mxwx.xpath.getReference(this.reminderCurrentUser), mx.session.getUserId());

                        // Then we save the mendix object via a microflow
                        mx.data.action({
                            params: {
                                applyto: 'selection',
                                actionname: this.mfToExecuteForReminderNote,
                                guids: [mxObj.getGuid()]
                            },
                            callback: lang.hitch(this, function (obj) {

                                // Refresh the data.
                                this._refreshData();

                            }),
                            error: function (error) {
                                console.log(error.description);
                            }
                        }, this);

                    }),
                    error: function (e) {
                        console.log("an error occured: " + e);
                    }
                });

            }));
        },