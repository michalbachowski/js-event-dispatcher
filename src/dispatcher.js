/*global: node */
"use strict";
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['require', 'priority-queue'], function(require, PriorityQueue) {
    return function (factory) {
        /**
         * @private
         */
        var listeners = {},
            create_queue = factory || function () {
                return new PriorityQueue({low: true});
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
                        listeners[name] = create_queue();
                    }
                    listeners[name].push(listener, priority);
                    return self;
                },

                /**
                 * Notifies listeners connected to given event until event is allowed to be propagated.
                 *
                 * @member EventDispatcher
                 * @param  Event event
                 * @return Event
                 */
                notify: function (name, event) {
                    event.markUnprocessed().startPropagation().setDispatcher(self).setName(name);
                    return self.iterate(name, event, function (listener) {
                        if (event.isPropagationStopped()) {
                            return;
                        }
                        listener(event);
                    });
                },

                /**
                 * Iterates throught listeners and for each listener executes given callback
                 *
                 * @private
                 * @member EventDispatcher
                 * @param  Event event to be called
                 * @param  function callback
                 * @return Event
                 */
                iterate: function (name, event, callback) {
                    if (!listeners.hasOwnProperty(name)) {
                        return event;
                    }
                    listeners[name].each(callback);
                    return event;
                },
            };
        return self;
    };
});
