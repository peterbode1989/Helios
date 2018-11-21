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
                step: 1, // the amount of cols to scroll when moving
                gutter: 15, // the default space between cols

                dots: false, // Boolean for showing/hiding the dots
                appendDots: null,
                elDots: '<li></li>',

                arrows: false, // Boolean for showing/hiding the arrows
                appendArrows: $(element), // Element to appen
                elPrevArrow: '<button class="helios-prev" aria-label="Previous" type="button">Previous</button>',
                elNextArrow: '<button class="helios-next" aria-label="Next" type="button">Next</button>',
            };
            _.options = $.extend({}, _.defaults, settings);

            _.$slider = $(element);

            _.init();
        }
        return Helios;
    }());

    Helios.prototype.buildArrows = function() {
        // all code that builds the arrows
        var _ = this;

    }

    Helios.prototype.buildDots = function() {
        // all code that builds the dots
        var _ = this;

    }

    Helios.prototype.deploy = function() {
        // all code that appends here.
        var _ = this;

        if(_.arrows)
            _.buildArrows();

        if(_.dots)
            _.buildDots();
    }

    Helios.prototype.init = function() {
        // all code that needs to be executed before the rest starts.
        var _ = this;

        console.log(_);

        if (!$(_.$slider).hasClass('helios')) {
            $(_.$slider).addClass('helios');
        }

        _.deploy();
    };

    $.fn.helios = function() {
        var _ = this;
        for (let i = 0; i < _.length; i++) {
            console.log(_[i]);
            _[i].helios = new Helios(_[i], arguments[0]);
        }
        return _;
    };
}));
