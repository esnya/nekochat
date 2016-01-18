(function ($) {
    'use strict';

    var fade = function (one, two, begin, middle, end) {
        var defaults = {
            duration: 400,
            delay: 0,
        };

        var options;

        if (typeof(one) == "function") {
            options = $.extend(defaults, {
                complete: one
            });
        } else if (typeof(one) == "object") {
            options = $.extend(defaults, {
                complete: one
            });
        } else {
            options = $.extend(defaults, {
                duration: one,
                complete: two
            });
        }

        begin.call(this);
        var bak = this.css('transition');

        this.css('transition', 'opacity ' + options.duration + 'ms ease-in-out ' + options.delay + 'ms');

        middle.call(this);

        setTimeout(function () {
            end.call(this);

            this.css('transition', bak);

            if (options.complete) {
                options.complete();
            }
        }.bind(this), options.delay + options.duration);

        return this;
    };
    ///
    $.fn.cssFadeIn = function (one, two) {
        return fade.bind(this)(one, two, function () {
            this.css('opacity', 0);
        }, function () {
            this.show();
        }, function () {
            this.css('opacity', '');
        });
    };
    ///
    $.fn.cssFadeOut = function (one, two) {
        return fade.call(this, one, two, function () {
        }, function () {
            this.css('opacity', 0);
        }, function () {
            this.hide();
        });
    };
})(jQuery);
