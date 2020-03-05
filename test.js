'use strict'

const {join} = require('path')
const exec = require('execa')
const {ok, strictEqual} = require('assert')

const bin = join(__dirname, 'cli.js')

const showError = (err) => {
	console.error(err)
	process.exitCode = 1
}

// todo
