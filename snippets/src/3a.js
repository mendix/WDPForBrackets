applyContext: function (context, callback) {

            // Check if we have data.
            if (context === null || context.getTrackId() === '') {
                if (this._debug) {
                    console.log('The Reminder Notes has no data!');
                }
                // Call the callback if set!
                if (typeof callback !== 'undefined') {
                    callback();
                }
            } else {

                mx.data.get({
                    guid     : context.getTrackId(),
                    callback : lang.hitch(this, function (callback, obj) {

                        // Set context object.
                        this._contextObj = obj;

                        // Render periods.
                        this._refreshData();

                        // Call the callback if set!
                        if (typeof callback !== 'undefined') {
                            callback();
                        }

                    })
                });

            }

        },