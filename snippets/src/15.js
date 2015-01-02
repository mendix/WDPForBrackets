// Refresh the data we use.
            _refreshData : function() {

                // Create filter first!
                mx.data.create({
                    entity: this.reminderNoteFilterEntity,
                    callback: lang.hitch(this, function( mxObj ) {

                        // We got the obj.
                        mxObj.set(this.reminderNoteFilterPagename, this.mxform.getTitle());

                        // Get reminder notes from webserver!
                        mx.data.action({
                            params          : {
                                applyto     : 'selection',
                                actionname  : this.mfToGetReminderNotes,
                                guids       : [mxObj.getGuid()]
                            },
                            callback        : lang.hitch(this,function( mxObjList ) {

                                // Set the loaded
                                this._loadedData = mxObjList;

                                // Refresh the userinterface.
                                this._refreshInterface();

                            }),
                            error           : function(error) {
                                console.log(error.description);
                            }
                        }, this);

                    }),
                    error: function(e) {
                        console.log("an error occured: " + e);
                    }
                });

            },