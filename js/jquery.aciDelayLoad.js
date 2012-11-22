
/*
 * aciDelayLoad jQuery Plugin v1.0
 * http://acoderinsights.ro
 *
 * Copyright (c) 2012 Dragos Ursu
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Require jQuery Library http://jquery.com
 *
 * Date: Wed Nov 21 16:20 2012 +0200
 */

(function($){

    $.aciDelayLoad = {
        nameSpace: '.aciDelayload'
    };

    $.fn.aciDelayLoad = function(options, data){
        if (typeof options == 'string'){
            return $(this)._aciDelayLoad(options, data);
        }
        return this.each(function(){
            return $(this)._aciDelayLoad(options, data);
        });
    };

    // default options
    $.fn.aciDelayLoad.defaults = {
        // the initial opacity of the image if fadeIn effect should be used when showing the image if not loaded yet
        // (need to be greater than 0 and lower than 1 or null)
        fadeIn: 0.1,
        duration: 200,                    // fadeIn effect duration (if any)
        easing: 'linear',                 // animation effect used with fadeIn (if any)
        dataSrc: 'data-src',              // IMG attribute name for holding the real image URL
        dataBlank: 'data-blank'           // IMG attribute name for holding the blank image URL (created at run-time)
    };

    $.fn._aciDelayLoad = function(options, data){

        var $this = this;

        var _options = $.extend({}, $.fn.aciDelayLoad.defaults, options);

        var _visible = function (element) {
            var html = document.documentElement;
            var rect = element.getBoundingClientRect();
            return (rect && (rect.bottom >= 0) && (rect.right >= 0) && (rect.top <= html.clientHeight) && (rect.left <= html.clientWidth));
        }

        var _refresh = function () {
            $this.find('img[' + _options.dataSrc + ']').each(function(){
                var $this = $(this);
                if (_visible(this)){
                    $this.attr(_options.dataBlank, $this.attr('src'));
                    if (_options.fadeIn) {
                        $this.fadeTo(0, _options.fadeIn).attr('src', $this.attr(_options.dataSrc)).fadeTo(_options.duration, 1, _options.easing);
                    } else {
                        $this.attr('src', $this.attr(_options.dataSrc));
                    }
                    $this.attr(_options.dataSrc, null);
                }
            });
        }

        var _timeout = null;

        var _enable = function(init){
            _disable();
            // load images on scroll/resize
            $this.bind('scroll' + $.aciDelayLoad.nameSpace, _refresh);
            if ($this.get(0) == document){
                $(window).bind('resize' + $.aciDelayLoad.nameSpace, function(){
                    if (_timeout) {
                        window.clearTimeout(_timeout);
                    }
                    _timeout = window.setTimeout(_refresh, 50);
                });
            }
        };

        var _disable = function(){
            // disable loading images on scroll/resize
            $this.unbind('scroll' + $.aciDelayLoad.nameSpace);
            if ($this.get(0) == document){
                $(window).unbind('resize' + $.aciDelayLoad.nameSpace);
            }
        };

        var _revert = function(){
            // revert IMG attributes
            $this.find('img[' + _options.dataBlank + ']').each(function(){
                var $this = $(this);
                $this.attr(_options.dataSrc, $this.attr('src')).attr('src', $this.attr(_options.dataBlank));
                $this.attr(_options.dataBlank, null);
            });
        };

        // init control based on options
        var _initUi = function(){
            if ((typeof options == 'undefined') || (typeof options == 'object')){
                // remember options
                $this.data('options' + $.aciDelayLoad.nameSpace, _options);
                _customUi();
            }
            // process custom request
            if (typeof options == 'string'){
                if ($this.data('customUi' + $.aciDelayLoad.nameSpace)){
                    // we get here is this was initialized
                    switch (options){
                        case 'enable':
                            _enable();
                            break;
                        case 'disable':
                            _disable();
                            break;
                        case 'revert':
                            _revert();
                            break;
                        case 'options':
                            // get options
                            return $this.data('options' + $.aciDelayLoad.nameSpace);
                        case 'destroy':
                            // destroy the control
                            _destroyUi();
                    }
                } else {
                    switch (options){
                        case 'options':
                            // get options
                            var initOpts = $this.data('options' + $.aciDelayLoad.nameSpace);
                            return initOpts ? initOpts : _options;
                    }
                }
            }
            // return this object
            return $this;
        };

        // destroy control
        var _destroyUi = function(){
            if ($this.data('customUi' + $.aciDelayLoad.nameSpace)){
                $this.data('customUi' + $.aciDelayLoad.nameSpace, null);
                $this.unbind($.aciDelayLoad.nameSpace);
                if ($this.get(0) == document){
                    $(window).unbind($.aciDelayLoad.nameSpace);
                }
                _revert();
            }
        }; // end _destroyUi

        // init custom UI
        var _customUi = function(){
            if ($this.data('customUi' + $.aciDelayLoad.nameSpace)){
                // return if already initialised
                return;
            }

            $this.data('customUi' + $.aciDelayLoad.nameSpace, true);

            _enable();

            // load images on update
            $this.bind('update' + $.aciDelayLoad.nameSpace, _refresh);

            // trigger initial update
            $this.trigger('update');

        }; // end _customUi

        // init the control
        return _initUi();

    };

})(jQuery);
