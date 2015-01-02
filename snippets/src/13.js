// Save position
            _savePositionSaving : function( event, ui ) {
                var $ = this.$,
                    mxwx = this._mxwx,
                    objIndex = ui.helper.attr('data-mx-note'),
                    position = ui.position,
                    mxObj = this._loadedData[objIndex];

                if (typeof mxObj !== 'undefined') {

                    mxObj.set(this.reminderNoteX, Math.abs(parseInt(position.left, 10)));
                    mxObj.set(this.reminderNoteY, Math.abs(parseInt(position.top, 10)));
                    this._saveContent(mxObj);

                }

            },