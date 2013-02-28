/*global: node */
"use strict";
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['./dispatcher', './event', './listener'], function (dispatcher, event, listener) {
    return {
        dispatcher: dispatcher,
        event: event,
        listener: listener
    };
});
