/*global: node */
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../src/event', '../node_modules/chai/chai'], function (Event, chai) {
    var assert = chai.assert;

    describe('Event', function () {
        var e;
        
        beforeEach(function () {
            e = null;
        });

        describe('subject', function () {
            describe('when no subject is given', function () {
                it('should return undefined', function () {
                    assert.isUndefined(Event().subject());
                });
            });
            
            describe('when subject is given', function () {
                it('should return given subject', function () {
                    assert.equal(Event('a').subject(), 'a');
                    assert.deepEqual(Event({a: 1}).subject(), {a: 1});
                    assert.isUndefined(Event(void 0).subject());
                    assert.equal(Event('').subject(), '');
                    assert.equal(Event(0).subject(), 0);
                });
            });
        });

        describe('name', function () {
            describe('when no name is given', function () {
                it('should return undefined', function () {
                    assert.isUndefined(Event().name());
                });
            });
            
            describe('when name is given', function () {
                it('should return given name', function () {
                    assert.equal(Event('a', 'b').name(), 'b');
                    assert.deepEqual(Event({a: 1}, {b: 2}).name(), {b: 2});
                    assert.isUndefined(Event(void 0, void 0).name());
                    assert.equal(Event(void 0, '').name(), '');
                    assert.equal(Event(void 0, 0).name(), 0);
                });
            });
        });

        describe('parameters', function () {
            describe('when no parameters are given', function () {
                it('should return empty dict', function () {
                    assert.deepEqual(Event().parameters(), {});
                });
            });
            
            describe('when parameters are given', function () {
                it('should return given parameters', function () {
                    assert.equal(Event('a', 'b', 'c').parameters(), 'c');
                    assert.deepEqual(Event('a', 'b', {c: 1}).parameters(), {c: 1});
                });
            });
            
            describe('when parameters are empty', function () {
                it('should return empty dict', function() {
                    assert.deepEqual(Event(void 0, void 0, void 0).parameters(), {});
                    assert.deepEqual(Event(void 0, void 0, '').parameters(), {});
                    assert.deepEqual(Event(void 0, void 0, 0).parameters(), {});
                });
            });
        });
        
        describe('parameter', function () {
            describe('when no key is given', function () {
                describe('and no parameters are given', function () {
                    it('should return undefined', function () {
                        assert.isUndefined(Event().parameter());
                    });
                });
                describe('and parameters are given', function () {
                    describe('and are invalid', function () {
                        it('should return undefined', function () {
                            assert.isUndefined(Event('a', 'b', 'c').parameter('a'));
                            assert.isUndefined(Event('a', 'b', void 0).parameter('a'));
                            assert.isUndefined(Event('a', 'b', {}).parameter('a'));
                        });
                    });
                    describe('and are valid', function () {
                        it('should return undefined', function () {
                            assert.isUndefined(Event('a', 'b', {c: 1}).parameter());
                        });
                    });
                });
            });
            
            describe('when invalid key and valie parameters are given', function () {
                it('should return undefined', function () {
                    assert.isUndefined(Event('a', 'b', {c: 1}).parameter('a'));
                    assert.isUndefined(Event('a', 'b', {c: 1}).parameter(''));
                    assert.isUndefined(Event('a', 'b', {c: 1}).parameter(0));
                    assert.isUndefined(Event('a', 'b', {c: 1}).parameter(void 0));
                });
            });

            describe('when valid key and parameters are given', function () {
                it('should return given parameter value', function () {
                    assert.equal(Event('a', 'b', {c: 1}).parameter('c'), 1);
                });
            });
        });
        
        describe('isPropagationStopped', function () {
            it('by default should return false', function () {
                assert.isFalse(Event().isPropagationStopped());
            });
            describe('when stopPropagation was called', function () {
                it('should return true', function () {
                    assert.isTrue(Event().stopPropagation().isPropagationStopped());
                });
            });
            describe('when startPropagation was called', function () {
                it('should return false', function () {
                    assert.isFalse(Event().startPropagation().isPropagationStopped());
                });
            });
            describe('when event propagation state is changed', function () {
                it('should return current process state', function () {
                    assert.isTrue(Event().stopPropagation().startPropagation().stopPropagation().isPropagationStopped());
                    assert.isFalse(Event().stopPropagation().startPropagation().isPropagationStopped());
                });
            });
        });

        describe('stopPropagation', function () {
            describe('when called', function () {
                it('should disallow event propagation', function () {
                    e = Event();
                    assert.isFalse(e.isPropagationStopped());
                    e.stopPropagation();
                    assert.isTrue(e.isPropagationStopped());
                });
                it('should return event instance', function () {
                    e = Event();
                    assert.strictEqual(e.stopPropagation(), e);
                });
            });
        });

        describe('startPropagation', function () {
            describe('when called', function () {
                it('should allow event propagation', function () {
                    e = Event();
                    assert.isFalse(e.isPropagationStopped());
                    e.stopPropagation();
                    assert.isTrue(e.isPropagationStopped());
                    e.startPropagation();
                    assert.isFalse(e.isPropagationStopped());
                });
                it('should return event instance', function () {
                    e = Event();
                    assert.strictEqual(e.startPropagation(), e);
                });
            });
        });

        describe('isProcessed', function () {
            it('by default should return false', function () {
                assert.isFalse(Event().isProcessed());
            });
            describe('when markProcessed was called', function () {
                it('should return true', function () {
                    assert.isTrue(Event().markProcessed().isProcessed());
                });
            });
            describe('when markUnprocessed was called', function () {
                it('should return false', function () {
                    assert.isFalse(Event().markUnprocessed().isProcessed());
                });
            });
            describe('when event process state is changed', function () {
                it('should return current process state', function () {
                    assert.isTrue(Event().markProcessed().markUnprocessed().markProcessed().isProcessed());
                    assert.isFalse(Event().markProcessed().markUnprocessed().isProcessed());
                });
            });
        });

        describe('markProcessed', function () {
            describe('when called', function () {
                it('should mark event as processed', function () {
                    e = Event();
                    assert.isFalse(e.isProcessed());
                    e.markProcessed();
                    assert.isTrue(e.isProcessed());
                });
                it('should return event instance', function () {
                    e = Event();
                    assert.strictEqual(e.markProcessed(), e);
                });
            });
        });

        describe('markUnprocessed', function () {
            describe('when called', function () {
                it('should mark event as processed', function () {
                    e = Event();
                    assert.isFalse(e.isProcessed());
                    e.markProcessed();
                    assert.isTrue(e.isProcessed());
                    e.markUnprocessed();
                    assert.isFalse(e.isProcessed());
                });
                it('should return event instance', function () {
                    e = Event();
                    assert.strictEqual(e.markUnprocessed(), e);
                });
            });
        });

        describe('setReturnValue', function () {
            describe('when called', function () {
                it('should return Event instance', function () {
                    e = Event();
                    assert.strictEqual(e.setReturnValue(), e);
                });
                it('should set return value to given value', function () {
                    e = Event();
                    assert.isUndefined(e.getReturnValue());
                    e.setReturnValue('foo');
                    assert.equal(e.getReturnValue(), 'foo');
                });
            });
        });

        describe('getReturnValue', function () {
            it('by default shuld return undefined', function () {
                assert.isUndefined(Event().getReturnValue());
            });
            describe('when return value was set', function () {
                it('should return given value', function () {
                    e = Event();
                    e.setReturnValue('');
                    assert.equal(e.getReturnValue(), '');
                    e.setReturnValue('a');
                    assert.equal(e.getReturnValue(), 'a');
                    e.setReturnValue(1);
                    assert.equal(e.getReturnValue(), 1);
                    e.setReturnValue();
                    assert.isUndefined(e.getReturnValue());
                    e.setReturnValue(void 0);
                    assert.isUndefined(e.getReturnValue());
                    e.setReturnValue({a: 1});
                    assert.deepEqual(e.getReturnValue(), {a: 1});
                });
            });
        });
    });
});
