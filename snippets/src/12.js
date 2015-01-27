// Setup dragable notes
        _setupEvents : function () {

            // Remove event handlers if they wore alreay attached.
            $('#' + this.id + ' .pin-yours').off();
            $('#' + this.id + ' .mx-note.mx-note-draggable').off();
            $('#' + this.id + ' .mx-note input[class=title]').off();
            $('#' + this.id + ' .mx-note textarea[class=mainText]').off();

            // Make the clicked note the active note!
            $('#' + this.id + ' .pin-yours').on('mouseup', lang.hitch(this, function (event) {

                // Variables
                var node = event.currentTarget || event.target,
                    objIndex = $(node).parent().parent().attr('data-mx-note'),
                    activeNote = $('.pin-selected');

                // If we have an active note then reset it to yours.
                if (typeof activeNote !== 'undefined') {
                    activeNote.removeClass('pin-selected');
                }

                // Loaded data
                if (this._loadedData !== null) {

                    // Set active note!
                    this._activeNote = this._loadedData[objIndex];

                    // Set selected pin.
                    $(node).addClass('pin-selected');
                }

            }));

            // Make the entire note draggable.
            $('#' + this.id + ' .mx-note.mx-note-draggable').draggable({
                stop: lang.hitch(this, function (event, ui) {

                    // Because we are subscribed to an mx object the subscribe function will also be fired after saving.
                    // To prevent anything from happing in the internface we have to set 'doNotUpdate'.
                    this._doNotUpdate = true;

                    // Save position.
                    this._savePositionSaving(event, ui);

                })
            });

            // Save title to mendix object.
            $('#' + this.id + ' .mx-note input[class=title]').on('keyup', lang.hitch(this, function (event, node) {

                var nodeEl = event.currentTarget || event.target,
                    noteIndex = $(nodeEl).parent().parent().parent().attr('data-mx-note'),
                    mxObj = this._loadedData[noteIndex];

                if (typeof mxObj !== 'undefined') {
                    mxObj.set(this.reminderNoteTitle, $(nodeEl).val());

                    // Because we are subscribed to an mx object the subscribe function will also be fired after saving.
                    // To prevent anything from happing in the internface we have to set 'doNotUpdate'.
                    this._doNotUpdate = true;

                    // Save content
                    this._saveContent(mxObj);
                }

            }));

            // Autogrow textarea's by jquery plugin.
            $('#' + this.id + ' .mx-note textarea[class=mainText]').autogrow({ 'onInitialize' : true });

            // Save description to mendix object.
            $('#' + this.id + ' .mx-note textarea[class=mainText]').on('keyup', lang.hitch(this, function (event, node) {

                var nodeEl = event.currentTarget || event.target,
                    objIndex = $(nodeEl).parent().parent().parent().attr('data-mx-note'),
                    mxObj = this._loadedData[objIndex];

                if (typeof mxObj !== 'undefined') {
                    mxObj.set(this.reminderNoteDescription, $(nodeEl).val());

                    // Because we are subscribed to an mx object the subscribe function will also be fired after saving.
                    // To prevent anything from happing in the internface we have to set 'doNotUpdate'.
                    this._doNotUpdate = true;

                    // Save content
                    this._saveContent(mxObj);
                }

            }));

        },