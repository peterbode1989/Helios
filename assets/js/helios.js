/**
 * Helios
 * Helios is a lightweight Bootstrap gridslider
 *
 * @author     Peter Bode <peter@acfbentveld.nl>
 */

(function(c, I, B) {
    c.fn.helios = function(l) {
        let a = c.extend({
            step: 4,
            show: 4,
            grid: 12,
        }, l);


        return this.each(function(i, e) {
            console.info(e);
        })
    }
})(jQuery, this, 0);
