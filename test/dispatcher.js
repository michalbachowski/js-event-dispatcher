/*global: node */
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../src/dispatcher', '../node_modules/chai/chai'], function (EventDispatcher, chai) {
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
