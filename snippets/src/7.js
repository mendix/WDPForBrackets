// Load google font
            _loadGoogleFont : function(){

                // Check if you are started up and do not load the font more then once.
                if(typeof window.__loadedGoogleFontGloriaHallelyjah !== 'undefined'){
                    return;
                }

                var googleFont = _googleFont();
                googleFont.loadFont();

            },
