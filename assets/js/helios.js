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
                arrows: false,
                dots: false,
                step: 1, // the amount of cols to scroll when moving
                gutter: 15, // the default space between cols
            };
            _.options = $.extend({}, _.defaults, settings);

            _.init();
        }
        return Helios;
    }());

    Helios.prototype.init = function() {
        var _ = this;
        console.log(_);
    };

    $.fn.helios = function() {
        var _ = this;
        for (let i = 0; i < _.length; i++) {
            _[i].helios = new Helios(_[i], arguments[0]);
        }
        return _;
    };
}));
