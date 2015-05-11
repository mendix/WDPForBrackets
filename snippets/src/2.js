// Internal variables.
        _contextObj : null,

        // TemplateString from a template file. 
        templateString : _templateReminderNotes,

        // Started
        _startUp : null,

        // Loaded data
        _loadedData : null,
        _reminderNotes : null,
        _activeNote : null,

        // Subscriptions
        _doNotUpdate : false,
            
        // Mobile event emulator
        _clickEvent: null,
        _mouseDownEvent: null,
        _mouseUpEvent: null,
        _mouseOutEvent: null,