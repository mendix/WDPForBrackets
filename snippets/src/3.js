update: function (obj, callback) {

                // Set context object.
                this._contextObj = obj;

                // Check if we have data.
                if (obj === null) {
                    if (this._debug) {
                        console.log('The Reminder Notes has no data!');
                    }
                }

                // Call the callback if set!
                if (typeof callback !== 'undefined') {
                    callback();
                }

            },