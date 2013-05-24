/*!
 * jQuery Lavalamp Plugin
 * https://github.com/dotsunited/jquery-lavalamp
 *
 * Copyright 2012, Dots United GmbH
 * Released under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 *
 * Updates:
 * JX 20130228 - added CSS hook classes for bubble on item hover
 */
(function($, window) {
    var Lavalamp = function(element, options) {
        this.element = $(element).data('lavalamp', this);
        this.options = $.extend({}, this.options, options);

        this.init();
    };

    Lavalamp.prototype = {
        options: {
            current:   '.current',
            items:     'li:not(.lavalamp-bubble)',
            bubble:    '<li class="lavalamp-bubble"></li>',
            animation: 400,
            blur:      $.noop,
            focus:     $.noop
        },
        element: null,
        current: null,
        bubble:  null,
        _focus:  null,
        init: function() {
            var resizeTimer,
                self = this;

            this.onWindowResize = function() {
                if (resizeTimer) {
                    clearTimeout(resizeTimer);
                }

                resizeTimer = setTimeout(function() {
                    self.reload();
                }, 100);
            };

            $(window).bind('resize.lavalamp', this.onWindowResize);

            this.element
                .on('mouseover.lavalamp', this.options.items, function() {
                    if (self.current.index(this) < 0) {
                        self.current.each(function() {
                            self.options.blur.call(this, self);
							self.bubble.addClass('hover'); //JX 20130228
                        });

                        self._move($(this));
                    }
                })
                .on('mouseout.lavalamp', function() {
                    if (self.current.index(self._focus) < 0) {
                        self._focus = null;

                        self.current.each(function() {
                            self.options.focus.call(this, self);
							self.bubble.removeClass('hover'); //JX 20130228
                        });

                        self._move(self.current);
                    }
                });

            this.bubble = $.isFunction(this.options.bubble)
                              ? this.options.bubble.call(this, this.element)
                              : $(this.options.bubble).appendTo(this.element);

            this.reload();
        },
        reload: function() {
            this.current = this.element.find(this.options.current);

            if (this.current.size() === 0) {
                this.current = this.element.find(this.options.items).eq(0);
            }

            this._move(this.current, false);
        },
        destroy: function() {
            if (this.bubble) {
                this.bubble.remove();
            }

            this.element.unbind('.lavalamp');
            $(window).unbind('resize.lavalamp', this.onWindowResize);
        },
        _move: function(el, animate) {
            var pos = el.position(),
                properties = {
                    left:   pos.left + 'px',
                    top:    pos.top + 'px',
                    width:  el.innerWidth() + 'px',
                    height: el.innerHeight() + 'px'
                };

            this._focus = el;

            if (!this.options.animation || animate === false) {
                this.bubble.css(properties);
            } else {
                if ($.isFunction(this.options.animation)) {
                    this.options.animation.call(this, properties);
                } else {
                    var options = typeof this.options.animation === 'object'
                                      ? this.options.animation
                                      : {duration: this.options.animation};

                    this.bubble.stop(true, false).animate(properties, options);
                }
            }
        }
    };

    $.fn.lavalamp = function(options) {
        if (typeof options === 'string') {
            var instance = $(this).data('lavalamp');
            return instance[options].apply(instance, Array.prototype.slice.call(arguments, 1));
        } else {
            return this.each(function() {
                var instance = $(this).data('lavalamp');

                if (instance) {
                    $.extend(instance.options, options || {});
                    instance.reload();
                } else {
                    new Lavalamp(this, options);
                }
            });
        }
    };
})(jQuery, window);
