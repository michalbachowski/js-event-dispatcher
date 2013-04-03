/*global: node */
"use strict";
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['require'], function(require, PriorityQueue) {
    return function () {
        "use strict";
        var self = this;

        this.register = function (dispatcher) {
            var mapping,
                priority;

            for(mapping in self.mapping()) {
                if (3 === mapping.length) {
                    priority = mapping[2];
                } else {
                    priority = void 0;
                }
                dispatcher.connect(mapping[0], mapping[1], priority);
            }
        };

        this.mapping = function () {
            throw ('Listener.mapping is not implemented');
            // Return list of event mappings: [[event, callback, priority], ...] or [[event, callback], ...] (default priority will be used)')
            /**
            return [
                ['foo', self.fooHandler],
                ['bar', self.barHandler]
            ];
            //*/
        };
    };
});
