// Internal variables.
            _contextGuid : null,
            _contextObj : null,

            // Dimensions
            _reminderNotesDimensions : null,
            _height : 300,

            // TemplateString from a template file.
            templateString : dojo.cache( 'ReminderNotes.widget.templates', 'ReminderNotes.html' ),

            // Started
            _startUp : null,
            _handle : null,

            // Loaded data
            _loadedData : null,
            _remimderNotes : null,
            _mxwx : null,
            _activeNote : null,

            // Subscriptions
            _doNotUpdate : false,