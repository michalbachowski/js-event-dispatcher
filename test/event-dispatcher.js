/*global: node */
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../src/event-dispatcher', '../node_modules/chai/chai', 'priority-queue'], function (EventDispatcher, chai, PriorityQueue) {
    var assert = chai.assert;

    describe('EventDispatcher', function () {
        var ed;
        
        beforeEach(function () {
            ed = EventDispatcher();
        });

        describe('', function () {
            describe('', function () {
                it('', function () {
                    assert.isTrue(false);
                });
            });
        });
    });
});
