/*global: node */
"use strict";
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['require', 'priority-queue'], function(require, PriorityQueue) {
    return function () {
        /**
         * @private
         */
        var listeners = {},

            /**
             * Iterates throught listeners and for each listener executes given callback
             *
             * @private
             * @member EventDispatcher
             * @param  Event event to be called
             * @param  function callback
             * @return Event
             */
            iterate = function (event, callback) {
                if (!listeners.hasOwnProperty(event.name())) {
                    return event;
                }
                listeners[event.name()].each(callback);
                return event;
            },

            self = {
                /**
                 * Connects given listener with event with given name.
                 * Order is set according to given priority
                 *
                 * @member EventDispatcher
                 * @param  string event name
                 * @param  function listener to be called
                 * @param  int listener priority (highest first). If not given priority of 100 will be used
                 * @return EventDispatcher
                 */
                connect: function (name, listener, priority) {
                    if (priority === undefined) {
                        priority = 100;
                    }
                    if (!listeners.hasOwnProperty(name)) {
                        listeners[name] = new PriorityQueue({low: true});
                    }
                    listeners[name].push(listener, priority);
                    return self;
                },

                /**
                 * Notifies all listeners connected to given event
                 *
                 * @member EventDispatcher
                 * @param  Event event
                 * @return Event
                 */
                notify: function (event) {
                    return iterate(event, function (listener) {
                        listener(event);
                    });
                },

                /**
                * Notifies listeners connected to given event until one of listeners returns "true".
                * When listener returns "true" event is marked as processed
                *
                * @member EventDispatcher
                * @param  Event event
                * @return Event
                */
                notifyUntil: function (event) {
                    event.markUnprocessed();
                    return iterate(event, function (listener) {
                        if (event.isProcessed()) {
                            return;
                        }
                        if (listener(event)) {
                            event.markProcessed();
                        }
                    });
                },

                /**
                 * Filter given value using given event
                 *
                 * @member EventDispatcher
                 * @param  Event event
                 * @param  mixed value to filter
                 * @return Event
                 */
                filter: function (event, value) {
                    iterate(event, function (listener) {
                        value = listener(event, value);
                    });
                    return event.setReturnValue(value);
                }
            };
        return self;
    };
});
