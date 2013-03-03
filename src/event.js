/*globals: node*/
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['require'], function (require) {
    "use strict";
    return function (subject, name, parameters) {
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
    };
});
