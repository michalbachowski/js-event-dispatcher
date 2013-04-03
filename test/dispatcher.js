/*global: node */
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../src/dispatcher', '../src/event', '../node_modules/priority_queue/src/priority_queue.js', '../node_modules/chai/chai', '../node_modules/sinon/lib/sinon'], function (EventDispatcher, Event, PriorityQueue, chai, sinon) {
    var assert = chai.assert;

    describe('EventDispatcher', function () {
        var ed, pq, mock, factory;
        
        beforeEach(function () {
            pq = new PriorityQueue();
            mock = sinon.mock(pq);
            factory = sinon.stub().returns(pq);
            ed = EventDispatcher(factory);
        });

        describe('constructor', function () {
            it('should accept alternative PriorityQueue implementation', function () {
                mock.expects('push').once();
                ed.connect('a', function () {});
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
                    ed.connect('aa', function () {}).connect('aa', function () {});
                    EventDispatcher(factory).connect('aa', function () {}).connect('aa', function () {});
                    assert.isTrue(factory.calledTwice);
                    mock.verify();
                });
            });
            
            describe('when called again with given name', function () {
                it('should re-use create internal priority queue instance', function() {
                    mock.expects('push').twice();
                    ed.connect('aa', function () {}).connect('aa', function () {});
                    assert.isTrue(factory.calledOnce);
                    mock.verify();
                });   
            });
            
            describe('when called without specific priority', function () {
                it('should use default priority', function () {
                    mock.expects('push').withExactArgs(sinon.match.typeOf("function"), 400).once();
                    ed.connect('aa', function () {}, 400);
                    mock.verify();
                });
            });

            describe('when called with specific priority', function () {
                it('should use that priority', function () {
                    mock.expects('push').withExactArgs(sinon.match.typeOf("function"), 20).once();
                    ed.connect('aa', function () {}, 20);
                    mock.verify();
                });
            });
        });

        describe('iterate', function () {
            describe('when nothing was given', function () {
                it('should return undefined', function () {
                    assert.isUndefined(EventDispatcher().iterate());
                });
                it('should not call internal queue', function () {
                    ed.iterate();
                    mock.verify();
                });
            });
            describe('when only name was given', function () {
                describe('and no listeners are connected with given name', function () {
                   it('should not call internal queue', function () {
                        ed.iterate('a');
                        mock.verify();
                    });
                    it('should return undefined', function () {
                        assert.isUndefined(EventDispatcher().iterate('a'));
                    });
                });
                describe('and some listeners are connected with given name', function () {
                    it('should call internal queue', function () {
                        mock.expects('push').once();
                        mock.expects('each').once().withExactArgs(sinon.match.undefined);
                        assert.isUndefined(ed.connect('a').iterate('a'));
                        mock.verify();
                    });
                    it('should raise exception', function () {
                        var err = false; 
                        ed = EventDispatcher();
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
                        ed.iterate('a', ev);
                        mock.verify();
                    });
                    it('should return event', function () {
                        assert.equal(EventDispatcher().iterate('a', ev), ev);
                    });
                });

                describe('and some listeners are connected with given name', function () {
                    it('should call internal queue', function () {
                        mock.expects('push').once();
                        mock.expects('each').once().withExactArgs(sinon.match.undefined);
                        assert.equal(ed.connect('a').iterate('a', ev), ev);
                        mock.verify();
                    });
                    it('should raise exception', function () {
                        var err = false; 
                        ed = EventDispatcher();
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
                        ed.iterate('a', ev);
                        mock.verify();
                    });
                    it('should return event', function () {
                        assert.equal(EventDispatcher().iterate('a', ev), ev);
                    });
                });

                describe('and some listeners are connected with given name', function () {
                    it('should return Event instance', function () {
                        mock.expects('push').once();
                        mock.expects('each').once();
                        assert.equal(ed.connect('a').iterate('a', ev, function () {}), ev);
                        mock.verify();
                    });
                    it('should call internal queue', function () {
                        var f = function () {};
                        mock.expects('push').once();
                        mock.expects('each').once().withExactArgs(f);
                        ed.connect('a').iterate('a', ev, f);
                        mock.verify();
                    });
                    it('should call iteration callback as many times as there are listeners', function () {
                        var listener = function () {},
                            callback = function (l) { l(); },
                            listenerSpy = sinon.spy(listener),
                            callbackSpy = sinon.spy(callback);

                        ed = EventDispatcher()
                        ed.connect('a', listenerSpy).connect('a', listenerSpy);
                        ed.iterate('a', ev, callbackSpy);
                        assert.isTrue(callbackSpy.withArgs(listenerSpy).calledTwice);
                        assert.isTrue(listenerSpy.withArgs().calledTwice);
                    });
                });
            });
        });

        describe('notify', function () {
            describe('when nothing was given', function () {
                it('should raise exception', function () {
                    var err = false; 
                    ed.connect('a', function () {});
                    try {
                        ed.notify();
                    } catch(e) {
                        err = true
                    }
                    assert.isTrue(err);
                });
            });
            describe('when only name was given', function () {
                it('should raise exception', function () {
                    var err = false; 
                    try {
                        ed.notify('a');
                    } catch(e) {
                        err = true
                    }
                    assert.isTrue(err);
                });
            });

            describe('when both name and event were given', function () {
                var ev, s;
                
                beforeEach(function () {
                    ev = Event();
                });

                describe('and event is not instance of Event', function () {
                    it('should raise exception', function () {
                        var err = false; 
                        try {
                            ed.notify('a', 'e');
                        } catch(e) {
                            err = true
                        }
                        assert.isTrue(err);
                    });
                });

                it('should call some methods on Event', function () {
                    var spy_mu = sinon.spy(ev, 'markUnprocessed'),
                        spy_sp = sinon.spy(ev, 'startPropagation'),
                        spy_sd = sinon.spy(ev, 'setDispatcher'),
                        spy_sn = sinon.spy(ev, 'setName');
                    
                    ed.notify('a', ev);

                    assert.isTrue(spy_mu.calledOnce);
                    assert.isTrue(spy_sp.calledOnce);
                    assert.isTrue(spy_sd.withArgs(ed).calledOnce);
                    assert.isTrue(spy_sn.withArgs('a').calledOnce);
                    assert.isTrue(spy_mu.calledBefore(spy_sp))
                    assert.isTrue(spy_mu.calledBefore(spy_sp))
                });

                it('should call "iterate" method on EventDispatcher', function () {
                    var spy = sinon.spy(ed, 'iterate');
                    
                    ed.notify('a', ev);

                    assert.isTrue(spy.withArgs('a', ev, sinon.match.typeOf("function")).calledOnce);
                });

                it('should return given Event', function () {
                    assert.equal(ed.notify('a', ev), ev);
                });
            });
        });
    });
});
