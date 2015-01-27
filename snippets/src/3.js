update: function (obj, callback) {

            // Check if we have data.
            if (obj === null) {
                if (this._debug) {
                    console.log('The Reminder Notes has no data!');
                }
                return;
            }

            // Set context object.
            this._contextObj = obj;

            // Render periods.
            this._refreshData();

            // Call the callback if set!
            if (typeof callback !== 'undefined') {
                callback();
            }

        },