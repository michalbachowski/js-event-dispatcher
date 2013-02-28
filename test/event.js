/*global: node */
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../src/event', '../node_modules/chai/chai'], function (Event, chai) {
    var assert = chai.assert;

    describe('Event', function () {
        var e;
        
        beforeEach(function () {
            e = Event();
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
