/*global: browser */

// Configure RequireJS
require.config({
    baseUrl:'../',
    urlArgs: "v="+(new Date()).getTime()
});

// Require libraries
require(['node_modules/chai/chai', 'node_modules/mocha/mocha'], function (chai) {
  // Chai
  assert = chai.assert;
  should = chai.should();
  expect = chai.expect;

  // Mocha
  mocha.setup('bdd');
  
  // Require base tests before starting
  require(['test/main', 'test/dispatcher', 'test/event', 'test/listener'], function (main, dispatcher, event, listener) {
    // Start runner
    mocha.run();
  });

});
