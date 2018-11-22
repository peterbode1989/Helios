/**
 * Helios
 *
 * Helios is a lightweight Bootstrap gridslider
 *
 * @package     Helios
 * @version     1.0.0
 * @author      Peter Bode <peter@acfbentveld.nl>
 */

;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {
    'use strict';
    var Helios = window.Helios || {};

    Helios = (function() {
        function Helios(element, settings) {
            var _ = this;

            _.defaults = {
                step: 2, // the amount of cols to scroll when moving
                gutter: 15, // the default space between cols
                infinite: false,

                dots: true, // Boolean for showing/hiding the dots
                appendDots: null,
                elDots: '<li></li>',

                arrows: false, // Boolean for showing/hiding the arrows
                appendArrows: $(element), // Element to appen
                elPrevArrow: '<button class="helios-arrow prev" aria-label="Previous" type="button">Previous</button>',
                elNextArrow: '<button class="helios-arrow next" aria-label="Next" type="button">Next</button>',
            };
            _.options = $.extend({}, _.defaults, settings);

            _.$slider = $(element);
            _.$children = $(element).children('div');
            _.$childrenCount = _.$children.length;
            _.$dotCount = Math.ceil(_.$childrenCount / _.options.step);
            _.$childSize = _.$children.outerWidth();
            _.$currentIndex = 0;

            _.init();
        }
        return Helios;
    }());

    Helios.prototype.queue = function(cD) {
        var _ = this;
        _.$slider.queue(function() {
            _.$children.each(function() {
                $(this).animate({
                    left: -parseFloat(cD),
                }, 1000, function() {
                    _.$slider.dequeue();
                });
            });
        });
    }

    Helios.prototype.move = function(_, e) {
        var _ = this;

        let dir = (_.options.step * -$(e.target).attr('data-dir'));
        _.$currentIndex -= dir;

        _.queue( _.$currentIndex * _.$childSize );
    }

    Helios.prototype.responsive = function() {
        var _ = this;

        _.$childSize = _.$children.outerWidth();

        _.queue( _.$currentIndex * _.$childSize );
    }

    Helios.prototype.buildArrows = function() {
        // all code that builds the arrows
        var _ = this;

        if(_.options.arrows === true) {
            // Apply default classes and events to elements
            _.$prevArrow = $(_.options.elPrevArrow)
                .addClass('helios-arrow helios-prev')
                .attr('data-dir', -1)
                .on('click', function(e) {
                    _.move(_, e);
                });

            _.$nextArrow = $(_.options.elNextArrow)
                .addClass('helios-arrow helios-next')
                .attr('data-dir', 1)
                .on('click', function(e) {
                    _.move(_, e);
                });


            // Append buttons to the selector
            _.$slider.append(_.$prevArrow);
            _.$slider.append(_.$nextArrow);
        }
    }

    Helios.prototype.buildDots = function() {
        // all code that builds the dots
        var _ = this;

        if(_.options.dots === true) {
            // do something
            let ul = $('<ul></ul>');

            for(var i = 0; i < _.$dotCount; i++) {
                let li = _.options.elDots;

                $(ul).append(li);
            }

            _.$slider.append(ul);
        }
    }

    Helios.prototype.deploy = function() {
        // all code that appends here.
        var _ = this;

        _.buildArrows();
        _.buildDots();

    }

    Helios.prototype.init = function() {
        // all code that needs to be executed before the rest starts.
        var _ = this;

        console.log(_);

        // Adds the default class for style purpose
        if (!$(_.$slider).hasClass('helios')) {
            $(_.$slider).addClass('helios');
        }

         $(window).on('resize', function() {
             _.resize();
         });

        _.deploy();
    };

    Helios.prototype.resize = function() {
        var _ = this;

        clearTimeout(_.windowDelay);
        _.windowDelay = window.setTimeout(function() {
            _.responsive();
        }, 50);
    };

    $.fn.helios = function() {
        var _ = this;
        for (let i = 0; i < _.length; i++) {
            _[i].helios = new Helios(_[i], arguments[0]);
        }
        return _;
    };
}));
