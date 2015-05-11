// dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            this._objProperty = {};
            
            // Mobile event emulator
            if (typeof document.ontouchstart !== 'undefined') {
                this._clickEvent = 'touchstart';
                this._mouseDownEvent = 'touchstart';
                this._mouseUpEvent = 'touchend';
                this._mouseOutEvent = 'touchend';
            } else {
                this._clickEvent = 'click';
                this._mouseDownEvent = 'mousedown';
                this._mouseUpEvent = 'mouseup';
                this._mouseOutEvent = 'mouseout';
            }
        },
            
        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');

            this._contextObj = obj;
            this._resetSubscriptions();
            this._refreshData();
			
            callback();
        },
        