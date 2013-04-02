/*global: node */
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../src/main', '../node_modules/chai/chai'], function (main, chai) {
    var assert = chai.assert;

    describe('Main', function () {
        it('should contain event function', function () {
            assert.isTrue(main.hasOwnProperty('event'));
        });
        it('should contain dispatcher function', function () {
            assert.isTrue(main.hasOwnProperty('dispatcher'));
        });
        it('should contain listener class', function () {
            assert.isTrue(main.hasOwnProperty('listener'));
        });
    });
});
