#!/bin/bash
PATH=$PATH:./node_modules/.bin:
export PATH
babel-node ./app.js $@ | bunyan -l DEBUG  -o short
