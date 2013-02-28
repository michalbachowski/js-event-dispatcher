REPORTER ?= dot

all: clean build test

build:
	node node_modules/requirejs/bin/r.js \
		-o name=src/event_dispatcher \
		out=build/event_dispatcher.js \
		baseUrl=.

clean:
	rm -rf build

test:
	./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		-u bdd test/event_dispatcher.js

.PHONY: all build clean test
