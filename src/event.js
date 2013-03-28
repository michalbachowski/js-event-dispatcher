/*globals: node*/
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['require'], function (require) {
    "use strict";
    return function (subject, parameters) {
        var args = parameters || {},
            value,
            name = void 0,
            dispatcher = void 0,
            processed = false,
            propagate = true,

            self = {
                /**
                 * Gets event subject (context)
                 *
                 * @member Event
                 * @return object
                 */
                getSubject: function () {
                    return subject;
                },


                /**
                 * Sets reference to event dispatcher
                 *
                 * @param  Dispatcher   event dispatcher
                 * @member Event
                 * @return Event
                 */
                setDispatcher: function (d) {
                    dispatcher = d;
                    return self;
                },
                /**
                 * Returns dispatcher object
                 * 
                 * @member Event
                 * @return Dispatcher
                 */
                getDispatcher: function () {
                    return dispatcher;
                },


                /**
                 * Sets event name
                 *
                 * @param  string    event name
                 * @member Event
                 * @return Event
                 */
                setName: function (n) {
                    name = n;
                    return self;
                },
                /**
                 * Returns event name
                 *
                 * @member Event
                 * @return string
                 */
                getName: function () {
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
                 * Checks whether event can be propagated
                 *
                 * @member Event
                 * @return boolean
                 */
                isPropagationStopped: function () {
                    return !propagate;
                },
                /**
                 * Disallows further event propagation
                 *
                 * @member Event
                 * @return Event
                 */
                stopPropagation: function () {
                    propagate = false;
                    return self;
                },
                /**
                 * Allows fusther event propagation 
                 *
                 * @member Event
                 * @return Event
                 */
                startPropagation: function () {
                    propagate = true;
                    return self;
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
    };
});
