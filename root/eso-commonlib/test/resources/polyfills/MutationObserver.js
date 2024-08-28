/**
 * *******************************************************************************
 * COPYRIGHT Ericsson 2018
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 * User: EEICMSY
 * Date: 21/05/18
 */

/*
   polyfill to handle use of window.MutationObserver in GenericPaginatedTable which
   tests running from cdt2 command line are not able to find causing parse errors
   and blocking tests running
 */

(function() {
    var MutationObserver;

    if (typeof window.MutationObserver !== 'undefined' && window.MutationObserver !== null) {
        return;
    }

    MutationObserver = (function() {
        function MutationObserver(callBack) {
            this.callBack = callBack;
        }

        MutationObserver.prototype.observe = function(element, options) {
            this.element = element;
            return this.interval = setInterval((function(_this) {
                return function() {
                    var html;
                    html = _this.element.innerHTML;
                    if (html !== _this.oldHtml) {
                        _this.oldHtml = html;
                        return _this.callBack.apply(null);
                    }
                };
            })(this), 200);
        };

        MutationObserver.prototype.disconnect = function() {
            return window.clearInterval(this.interval);
        };

        return MutationObserver;

    })();

    window.MutationObserver = MutationObserver;

}).call(this);
