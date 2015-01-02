// Refresh the interface we use.
            _refreshInterface : function(){
                var $ = this.$;

                // Remove event and remove html from domNode.
                $(this.domNode).off();
                $(this.domNode).html('');

                // Render output
                this._renderReminderNotesResult(this._loadedData);

                // Render sidebar
                this._renderSideBar();

            }
