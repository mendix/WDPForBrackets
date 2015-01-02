// Setup widget.
            _setupWidget : function() {

                // Set mxwx!
                this._mxwx = new MxWidgetAssist();

                // Attach new function to jQuery.
                var $ = this.$;

                // Set class for domNode
                $(this.domNode).addClass('mx-reminder-notes-container');

            },