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
                namespace: 'helios',
                step: 2, // the amount of cols to scroll when moving
                gutter: 15, // the default space between cols
                infinite: true,
                duration: 1000,

                dots: true, // Boolean for showing/hiding the dots
                appendDots: $(element),
                elDots: '<li><a href="#"></a></li>',

                arrows: true, // Boolean for showing/hiding the arrows
                appendArrows: $(element), // Element to appen
                elPrevArrow: '<button class="helios-arrow prev" aria-label="Previous" type="button">Previous</button>',
                elNextArrow: '<button class="helios-arrow next" aria-label="Next" type="button">Next</button>',
            };

            _.options = $.extend({}, _.defaults, settings);

            _.$slider = $(element);
            _.$sliderSize = _.$slider.outerWidth();
            _.$children = _.$slider.children('div[class^=\'col-\']');
            _.$clonedChildren = [];
            console.log(_.$clonedChildren);
            _.$childrenCount = _.$children.length;
            _.$childSize = _.$children.outerWidth();
            _.$dotCount = Math.ceil(_.$childrenCount / _.options.step);
            _.$colCount = Math.round(_.$sliderSize / _.$childSize);
            _.$currentIndex = 0;
            _.$offset = (_.$childSize * _.options.step);

            _.$currentPos = _.$currentIndex * _.options.step - (_.$childSize * _.options.step);
            _.$basePos = _.$currentPos;

            _.$startOrder = Array.apply(null, Array(_.$childrenCount)).map(function (x, i) { return i });
            _.$currentOrder = _.$startOrder;

            _.init();
        }
        return Helios;
    }());

    Helios.prototype.queue = function(duration) {
        var _ = this;
        duration = duration || _.options.duration;

        _.$slider.queue(function() {
            _.$children.each(function() {
                $(this).animate({
                    left: -parseFloat(_.$offset + (_.$currentIndex * _.$childSize)),
                }, duration, function() {
                    _.$slider.dequeue();
                });
            });

        });

        _.$slider.queue(function() {
            // queue callback workaround..
            _.$currentPos = -parseFloat(_.$offset + (_.$currentIndex * _.$childSize));

            _.virtualscrolling(_.$offset + (_.$currentIndex * _.$childSize));

            _.update();
        });
    }

    Helios.prototype.changeSlide = function(event) {
        var _ = this;

        var operators = {
            'previous': function() { return _.$currentIndex -= _.options.step },
            'next': function() { return _.$currentIndex += _.options.step },
            'index': function() { return event.data.val },
            'resize': function() { return _.$currentIndex },
        };


        // console.warn(
        _.$currentIndex = operators[event.data.message]();
        console.log(_.$currentIndex);
        // );


        switch (event.data.message) {
            case 'previous':
                _.queue();
                break;

            case 'next':
                _.queue();
                break;

            case 'index':
                _.queue();
                break;

            case 'resize':
                _.queue( event.data.duration );
                break;

            default:
                return;
        }

    };

    Helios.prototype.next = function() {
        var _ = this;

        _.changeSlide({
            data: {
                message: 'next',
            }
        });
    }

    Helios.prototype.previous = function() {
        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous',
            }
        });
    }

    Helios.prototype.index = function(value) {
        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                val: value,
            }
        });
    }

    Helios.prototype.resize = function() {
        var _ = this;

        clearTimeout(_.windowDelay);
        _.windowDelay = window.setTimeout(function() {

            _.changeSlide({
                data: {
                    message: 'resize',
                    duration: _.options.duration,
                }
            });

            // Re-init all values after resize-event is resolved
            _.update();

        }, 50);
    }

    Helios.prototype.buildArrows = function() {
        // all code that builds the arrows
        var _ = this;

        if(_.options.arrows === true) {
            // Apply default classes and events to elements
            _.$prevArrow = $(_.options.elPrevArrow)
                .addClass(_.options.namespace+'-arrow')
                .addClass(_.options.namespace+'-prev')
                .on('click', function() {
                    _.previous();
                });

            _.$nextArrow = $(_.options.elNextArrow)
                .addClass(_.options.namespace+'-arrow')
                .addClass(_.options.namespace+'-next')
                .on('click', function() {
                    _.next();
                });

            _.options.elPrevArrow = _.$prevArrow;
            _.options.elNextArrow = _.$nextArrow;

            // Append buttons to the selector

            $(_.options.appendArrows).append(_.options.elPrevArrow);
            $(_.options.appendArrows).append(_.options.elNextArrow);
        }
    }

    Helios.prototype.buildDots = function() {
        // all code that builds the dots
        var _ = this;

        if(_.options.dots === true) {
            // do something
            // let ul = $(_.options.appendDots);
            let ul = $('<ul class="'+_.options.namespace+'-dots'+'"></ul>');

            for(var i = 0; i < _.$dotCount; i++) {
                let li = $(_.options.elDots)
                    .attr('data-step', (i * _.options.step))
                    .on('click', function(e) {
                        _.index( parseInt($(this).attr('data-step')) );
                    });

                $(ul).append(li);
            }


            $(_.options.appendDots).append(ul);
        }
    }

    Helios.prototype.update = function() {
        var _ = this;
        // if(_.$childSize !== $(_.$clonedChildren).first().outerWidth()) {
        //     _.$childSize = _.$children.outerWidth();
        //     _.$sliderSize = _.$slider.outerWidth();
        //
        //     _.$colCount = Math.round(_.$sliderSize / _.$childSize);
        // }

        if(_.options.arrows === true) {
            if(_.$currentIndex == 0 && _.options.infinite === false) {
                _.options.elPrevArrow.attr('disabled', 'disabled');
            } else {
                _.options.elPrevArrow.removeAttr('disabled', 'disabled');
            }
            if(_.$childrenCount == (_.$currentIndex + _.options.step) && _.options.infinite === false) {
                _.options.elNextArrow.attr('disabled', 'disabled');
            } else {
                _.options.elNextArrow.removeAttr('disabled', 'disabled');
            }
        }

        if(_.options.dots === true) {
            $(_.options.appendDots).find('ul').children('li').each(function() {
                $(this).removeClass('active');
                if(_.$currentIndex == parseInt($(this).attr('data-step'))) {
                    $(this).addClass('active');
                }
            });
        }
    }

    Helios.prototype.virtualscrolling = function(cD) {
        var _ = this;

        cD = cD || 0;

        console.log(_.$currentIndex);

        Array.prototype.resort = function(i){
          var i = i > this.length ? 0 : i;
          return [].concat(this.slice(i), this.slice(0, i));
        }

        _.$currentOrder = _.$startOrder.resort(_.$currentIndex-_.options.step);
        let order = _.$currentOrder.slice(0, (_.$colCount + (_.options.step * 2)));

        console.log(order);

        _.$children.each(function() {
            if(!$(this).hasClass(_.options.namespace + '-clone'))
                _.$clonedChildren.push($(this).detach());
            else
                $(this).detach();
        });
        //
        let children = order.map(function(i){
            return $(_.$clonedChildren[i])
                .addClass(_.options.namespace + '-clone');
        });
        //

        _.$slider.prepend(children);

        _.$children = _.$slider.children('div[class^=\'col-\']');

        _.$children.each(function() {
            $(this).css('left', _.$currentPos);
        });
    }

    Helios.prototype.render = function() {
        var _ = this;

        // _.buildInfinite();
        _.virtualscrolling();
        _.buildArrows();
        _.buildDots();

        _.update();
    }

    Helios.prototype.init = function() {
        var _ = this;

        // Adds the default class for style purpose
        if (!$(_.$slider).hasClass('helios'))
            $(_.$slider).addClass('helios');

         $(window).on('resize', function() {
             _.resize();
         });

        _.render();
    };

    $.fn.helios = function() {
        var _ = this;
        for (let i = 0; i < _.length; i++) {
            _[i].helios = new Helios(_[i], arguments[0]);
        }
        return _;
    };
}));
