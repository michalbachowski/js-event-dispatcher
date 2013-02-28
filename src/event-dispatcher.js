var EventDispatcherFactory = function (PriorityQueue) {
        "use strict";
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
    },
    EventDispatcher,

    Event = function (subject, name, parameters) {
        "use strict";
        var args = parameters || {},
            value,
            processed = false,

            self = {
                /**
                 * Returns subject object
                 * 
                 * @member Event
                 * @return object
                 */
                subject: function () {
                    return subject;
                },

                /**
                 * Returns event name
                 *
                 * @member Event
                 * @return string
                 */
                name: function () {
                    return name;
                },

                /**
                 * Sets return value for event
                 *
                 * @member Event
                 * @param object value to be returned
                 * @return Event
                 */
                setReturnValue: function (val) {
                    value = val;
                    return self;
                },

                /**
                 * Fetches event`s return value
                 *
                 * @member Event
                 * @return object
                 */
                getReturnValue: function () {
                    return value;
                },

                /**
                 * Checks whether event has been processed
                 *
                 * @member Event
                 * @return boolean
                 */
                isProcessed: function () {
                    return processed;
                },

                /**
                 * Marks event as processed
                 *
                 * @member Event
                 * @return Event
                 */
                markProcessed: function () {
                    processed = true;
                    return self;
                },

                /**
                 * Marks event as unprocessed
                 *
                 * @member Event
                 * @return Event
                 */
                markUnprocessed: function () {
                    processed = false;
                    return self;
                },

                /**
                 * Fetches list of parameters
                 *
                 * @member Event
                 * @return dict
                 */
                parameters: function () {
                    return args;
                },

                /**
                 * Fetches parameter with given name or undefined if parameter is not present
                 *
                 * @member Event
                 * @param  string parameter name
                 * @return mixed
                 */
                parameter: function (key) {
                    if (args.hasOwnProperty(key)) {
                        return args[key];
                    }
                    return void 0;
                }
            };

        return self;
    },

    Listener = function () {
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

// init EventDispatcher
try {
    EventDispatcher = EventDispatcherFactory(PriorityQueue);
} catch (e) {
}