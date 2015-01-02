_refreshNote : function( objWithUsers, i ){

                // Variables
                var $ = this.$,
                    newTemplateNote = dojo.cache( 'ReminderNotes.widget.templates', 'ReminderNote.html'),

                    obj = objWithUsers.obj,
                    user = objWithUsers.user,
                    id = objWithUsers.id,
                    posx = obj.get(this.reminderNoteX),
                    posy = obj.get(this.reminderNoteY),

                    // We want to create a random rotation effect.
                    degree =  Math.floor(Math.random() * 6) + 1,
                    degreeNegative = -degree,
                    degreeToUse = (this._isEven(i)) ? degree : degreeNegative,
                    degrees = '-ms-transform-origin: 50% 0;'+
                        '-ms-transform: rotate('+degreeToUse+'deg);'+
                        '-webkit-transform-origin: 50% 0;'+
                        '-webkit-transform: rotate('+degreeToUse+'deg);'+
                        'transform-origin: 50% 0;'+
                        'transform: rotate('+degreeToUse+'deg);';


                // Position
                newTemplateNote = newTemplateNote.split('{{style}}').join('left: ' + posx + 'px;top: ' + posy + 'px;' + degrees);

                // Creating a data attribute that can link back to a mendix object.
                newTemplateNote = newTemplateNote.split('{{idnumber}}').join(id);
                newTemplateNote = newTemplateNote.split('{{idnumberclass}}').join('data-mx-note-' + this.mxform.id + '-' +id);

                // Altering title and position.
                newTemplateNote = newTemplateNote.split('{{title}}').join(obj.get(this.reminderNoteTitle));
                newTemplateNote = newTemplateNote.split('{{description}}').join(obj.get(this.reminderNoteDescription));

                // Disable and set readonly if the user is not the same who wrote the message!
                newTemplateNote = newTemplateNote.split('{{readonly}}').join( (user.getGUID() !== mx.session.getUserId()) ? 'readonly="readonly"' : '' );

                // Disable dragging if the note is not of the current user!
                newTemplateNote = newTemplateNote.split('{{disabledrag}}').join( (user.getGUID() !== mx.session.getUserId()) ? '' : 'mx-note-draggable' );

                // Show your pins!
                newTemplateNote = newTemplateNote.split('{{yours}}').join( (user.getGUID() !== mx.session.getUserId()) ? '-normal' : '-yours' );

                // Created
                newTemplateNote = newTemplateNote.split('{{createdby}}').join(user.get(this.reminderNoteEntityUserFullname) + ' ( ' + mx.parser.formatValue( obj.get(this.reminderNoteDate) , "datetime", { datePattern: "dd-MM-yyyy H:m:s" }) + ' ) ');

                // Return back the newly created note!
                return newTemplateNote;
            },