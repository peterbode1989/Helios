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
            _.$clonedChildren = _.$children.clone();
            _.$childrenCount = _.$children.length;
            _.$childSize = _.$children.outerWidth();
            _.$dotCount = Math.ceil(_.$childrenCount / _.options.step);
            _.$colCount = Math.round(_.$sliderSize / _.$childSize);
            _.$currentIndex = 0;
            _.$currentPos = _.$currentIndex * _.options.step;
            _.$startOrder = Array.apply(null, Array(_.$childrenCount)).map(function (x, i) { return i });
            _.$currentOrder = _.$startOrder;

            _.init();
        }
        return Helios;
    }());

    Helios.prototype.queue = function(cD, duration) {
        var _ = this;
        duration = duration || _.options.duration;

        _.$slider.queue(function() {
            _.$children.each(function() {
                $(this).animate({
                    left: -parseFloat(cD),
                }, duration, function() {
                    _.$slider.dequeue();
                });
            });
            _.$currentPos = -parseFloat(cD);
            _.update();
        });
    }

    Helios.prototype.move = function(_, e) {
        var _ = this;

        let dir = parseInt($(e.target).attr('data-dir'));

        _.updateIndex('move', dir);



        // this add max slide scrolling for last elements..
        // let dynamic = (_.$currentIndex * _.$childSize); // temp slide maxer
        // _.queue( (dynamic >= _.$sliderSize ? _.$sliderSize : dynamic) );

        _.queue( (_.$currentIndex * _.$childSize) );
    }

    Helios.prototype.responsive = function(duration) {
        var _ = this;
        duration = duration || _.options.duration;


        _.queue( (_.$currentIndex * _.$childSize), duration );
        _.update();
    }

    Helios.prototype.updateIndex = function(type, dir) {
        var _ = this;

        if(type === 'move') _.$currentIndex -= dir;
        if(type === 'equal') _.$currentIndex = dir;

        if(_.$currentIndex >= _.$childrenCount) {
            _.$currentIndex += -(_.$childrenCount);
        }
    }

    Helios.prototype.buildArrows = function() {
        // all code that builds the arrows
        var _ = this;

        if(_.options.arrows === true) {
            // Apply default classes and events to elements
            _.$prevArrow = $(_.options.elPrevArrow)
                .addClass(_.options.namespace+'-arrow')
                .addClass(_.options.namespace+'-prev')
                .attr('data-dir', _.options.step * 1)
                .on('click', function(e) {
                    _.move(_, e);
                });

            _.$nextArrow = $(_.options.elNextArrow)
                .addClass(_.options.namespace+'-arrow')
                .addClass(_.options.namespace+'-next')
                .attr('data-dir', _.options.step * -1)
                .on('click', function(e) {
                    _.move(_, e);
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
                        _.updateIndex('equal', parseInt($(this).attr('data-step')));
                        _.responsive();
                    });

                $(ul).append(li);
            }


            $(_.options.appendDots).append(ul);
        }
    }

    Helios.prototype.update = function() {
        var _ = this;



        if(_.$childSize !== _.$clonedChildren.outerWidth()) {
            _.$childSize = _.$children.outerWidth();
            _.$sliderSize = _.$slider.outerWidth();

            _.$colCount = Math.round(_.$sliderSize / _.$childSize);
        }


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

        _.virtualscrolling();
    }

    Helios.prototype.virtualscrolling = function() {
        var _ = this;

        Array.prototype.resort = function(i){
          var i = i > this.length ? 0 : i;
          return [].concat(this.slice(i), this.slice(0, i));
        }

        _.$currentOrder = _.$startOrder.resort(_.$currentIndex-_.options.step);
        console.log(_.$currentOrder);
        let order = _.$currentOrder.slice(0, (_.$colCount + (_.options.step * 2)));

        console.log(order);

        _.$children.each(function() {
            if(!$(this).hasClass(_.options.namespace + '-clone')) _.$clonedChildren.push($(this).detach());
            else $(this).detach();
        });

        let children = order.map(function(i){
            $(_.$clonedChildren[i]).addClass(_.options.namespace + '-clone');
            // $(_.$clonedChildren[i]).css('left', -((_.$colCount * _.$childSize)*_.$currentIndex));
            $(_.$clonedChildren[i]).css('left', _.$currentPos);
            return _.$clonedChildren[i];
        });

        _.$slider.prepend(children);
        _.$children = _.$slider.children('div[class^=\'col-\']');
    }

    Helios.prototype.render = function() {
        // all code that appends here.
        var _ = this;

        // _.buildInfinite();
        _.buildArrows();
        _.buildDots();

        _.virtualscrolling();

        _.update();
    }

    Helios.prototype.init = function() {
        // all code that needs to be executed before the rest starts.
        var _ = this;

        // Adds the default class for style purpose
        if (!$(_.$slider).hasClass('helios')) {
            $(_.$slider).addClass('helios');
        }

         $(window).on('resize', function() {
             _.resize();
         });

        _.render();
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
