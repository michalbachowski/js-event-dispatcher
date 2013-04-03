REPORTER ?= dot

all: clean build test

build:
	node node_modules/.bin/r.js -o src/app.build.js

clean:
	rm -rf build

test:
	./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		-u bdd \
		test/dispatcher.js \
		test/event.js \
		test/listener.js \
		test/main.js

.PHONY: all build clean test
