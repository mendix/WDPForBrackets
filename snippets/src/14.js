// Save title, description and or position.
            _saveContent : function ( mxObj ){
                mx.data.action({
                    params: {
                        applyto: 'selection',
                        actionname: this.mfToExecuteForReminderNote,
                        guids: [mxObj.getGuid()]
                    },
                    callback: lang.hitch(this, function (obj) {
                        // We need to do nothing.. just on the server side!
                    }),
                    error: function (error) {
                        console.log(error.description);
                    }
                }, this);
            },