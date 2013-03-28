/*global: node */
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../src/dispatcher', '../src/event', '../node_modules/priority-queue/src/priority_queue.js', '../node_modules/chai/chai', '../node_modules/sinon/lib/sinon'], function (EventDispatcher, Event, PriorityQueue, chai, sinon) {
    var assert = chai.assert;

    describe('EventDispatcher', function () {
        var ed, pq, mock, factory;
        
        beforeEach(function () {
            pq = new PriorityQueue();
            mock = sinon.mock(pq);
            ed = EventDispatcher();
            factory = sinon.stub().returns(pq);
        });

        describe('constructor', function () {
            it('should accept alternative PriorityQueue implementation', function () {
                mock.expects('push').once();
                EventDispatcher(factory).connect('a', function () {});
                assert.isTrue(factory.called);
                mock.verify();
            });
        });
        
        describe('connect', function () {
            it('should return EventDispatcher instance', function () {
                assert.equal(ed.connect(), ed);
            });
            describe('when called for ther first time with given name', function () {
                it('should create internal priority queue instance', function() {
                    mock.expects('push').exactly(4);
                    EventDispatcher(factory).connect('aa', function () {}).connect('aa', function () {});
                    EventDispatcher(factory).connect('aa', function () {}).connect('aa', function () {});
                    assert.isTrue(factory.calledTwice);
                    mock.verify();
                });
            });
            
            describe('when called again with given name', function () {
                it('should re-use create internal priority queue instance', function() {
                    mock.expects('push').twice();
                    EventDispatcher(factory).connect('aa', function () {}).connect('aa', function () {});
                    assert.isTrue(factory.calledOnce);
                    mock.verify();
                });   
            });
            
            describe('when called without specific priority', function () {
                it('should use default priority', function () {
                    mock.expects('push').withExactArgs(sinon.match.typeOf("function"), 400).once();
                    EventDispatcher(factory).connect('aa', function () {}, 400);
                    mock.verify();
                });
            });

            describe('when called with specific priority', function () {
                it('should use that priority', function () {
                    mock.expects('push').withExactArgs(sinon.match.typeOf("function"), 20).once();
                    EventDispatcher(factory).connect('aa', function () {}, 20);
                    mock.verify();
                });
            });
        });

        describe('iterate', function () {
            describe('when nothing was given', function () {
                it('should return undefined', function () {
                    assert.isUndefined(ed.iterate());
                });
                it('should not call internal queue', function () {
                    EventDispatcher(factory).iterate();
                    mock.verify();
                });
            });
            describe('when only name was given', function () {
                describe('and no listeners are connected with given name', function () {
                   it('should not call internal queue', function () {
                        EventDispatcher(factory).iterate('a');
                        mock.verify();
                    });
                    it('should return undefined', function () {
                        assert.isUndefined(ed.iterate('a'));
                    });
                });
                describe('and some listeners are connected with given name', function () {
                    it('should call internal queue', function () {
                        mock.expects('push').once();
                        mock.expects('each').once().withExactArgs(sinon.match.undefined);
                        assert.isUndefined(EventDispatcher(factory).connect('a').iterate('a'));
                        mock.verify();
                    });
                    it('should raise exception', function () {
                        var err = false; 
                        ed.connect('a', function () {});
                        try {
                            ed.iterate('a');
                        } catch(e) {
                            err = true
                        }
                        assert.isTrue(err);
                    });
                });
            });

            describe('when only name and event were given', function () {
                var ev;
                
                beforeEach(function () {
                    ev = Event();
                });

                describe('and no listeners are connected with given name', function () {
                   it('should not call internal queue', function () {
                        EventDispatcher(factory).iterate('a', ev);
                        mock.verify();
                    });
                    it('should return event', function () {
                        assert.equal(ed.iterate('a', ev), ev);
                    });
                });

                describe('and some listeners are connected with given name', function () {
                    it('should call internal queue', function () {
                        mock.expects('push').once();
                        mock.expects('each').once().withExactArgs(sinon.match.undefined);
                        assert.equal(EventDispatcher(factory).connect('a').iterate('a', ev), ev);
                        mock.verify();
                    });
                    it('should raise exception', function () {
                        var err = false; 
                        ed.connect('a', function () {});
                        try {
                            ed.iterate('a', ev);
                        } catch(e) {
                            err = true
                        }
                        assert.isTrue(err);
                    });
                });
            });
            
            describe('when all arguments were given', function () {
                var ev;
                
                beforeEach(function () {
                    ev = Event();
                });

                describe('and no listeners are connected with given name', function () {
                   it('should not call internal queue', function () {
                        EventDispatcher(factory).iterate('a', ev);
                        mock.verify();
                    });
                    it('should return event', function () {
                        assert.equal(ed.iterate('a', ev), ev);
                    });
                });

                describe('and some listeners are connected with given name', function () {
                    it('should return Event instance', function () {
                        mock.expects('push').once();
                        mock.expects('each').once();
                        assert.equal(EventDispatcher(factory).connect('a').iterate('a', ev, function () {}), ev);
                        mock.verify();
                    });
                    it('should call internal queue', function () {
                        var f = function () {};
                        mock.expects('push').once();
                        mock.expects('each').once().withExactArgs(f);
                        EventDispatcher(factory).connect('a').iterate('a', ev, f);
                        mock.verify();
                    });
                    it('should call iteration callback as many times as there are listeners', function () {
                        var listener = function () {},
                            callback = function (l) { l(); },
                            listenerSpy = sinon.spy(listener),
                            callbackSpy = sinon.spy(callback);

                        ed.connect('a', listenerSpy).connect('a', listenerSpy);
                        ed.iterate('a', ev, callbackSpy);
                        assert.isTrue(callbackSpy.withArgs(listenerSpy).calledTwice);
                        assert.isTrue(listenerSpy.withArgs().calledTwice);
                    });
                });
            });
        });

        describe('notify', function () {
        });
    });
});
