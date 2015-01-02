// Uninitialize.
            uninitialize : function(){
                var $ = this.$;
                $(this.domNode).off();
                $(this.domNode).html('');
            },