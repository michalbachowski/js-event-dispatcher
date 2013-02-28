/*global: node */
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../src/listener', '../node_modules/chai/chai'], function (Listener, chai) {
    var assert = chai.assert;

    describe('Listener', function () {
        var l;
        
        beforeEach(function () {
            l = Listener();
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
