startup: function () {

            // Check if you are started up!
            if (this._startUp === null) {
                this._startUp = false;
            }
            if (this._startUp === false) {
                this._startUp = true;
            } else {
                return;
            }

            // Setup widget
            this._setupWidget();

            // Render periods.
            this._refreshData();

        },