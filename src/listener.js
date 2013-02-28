/*global: node */
"use strict";
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['require'], function(require, PriorityQueue) {
    return function () {
        "use strict";
        var self = this;
        this.dispatcher = void 0;

        this.register = function (dispatcher) {
            self.dispatcher = dispatcher;
            var idx,
                mappings = self.mapping(),
                callback,
                priority;

            for(idx in self.mapping()) {
                priority = 400;
                if (typeof (mappings[idx]) === "function") {
                    callback = mappings[idx];
                } else if (2 === mappings[idx].length) {
                    callback = mappings[idx][0];
                    priority = mappings[idx][1];
                } else {
                    throw ('Unknown mapping');
                }
                dispatcher.connect(idx, callback, priority);
            }
        };
        this.mapping = function () {
            throw ('Return list of "{event: callback}" or "{event: [callback, priority]}" mappings');
        };
    };
});
