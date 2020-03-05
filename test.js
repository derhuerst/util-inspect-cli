'use strict'

const {join} = require('path')
const escape = require('any-shell-escape')
const execa = require('execa')
const {throws, ok, strictEqual} = require('assert')
const {inspect} = require('util')

const bin = join(__dirname, 'cli.js')

const showError = (err) => {
	console.error(err)
	process.exitCode = 1
}

const exec = (input, cmdOpts) => {
	const echo = `echo ${escape(JSON.stringify(input))}`
	return execa.sync(`${echo} | ${bin} ${cmdOpts}`, {shell: true})
}
const assertFails = (input, cmdOpts) => {
	try {
		exec(input, cmdOpts)
	} catch (err) {
		strictEqual(err.exitCode, 1, 'exit code not 1')
		strictEqual(err.stdout, '', 'non-empty stdout')
		ok(err.stderr, 'empty stderr')
	}
}
const assertPrints = (input, cmdOpts, inspectOpts) => {
	const res = exec(input, cmdOpts)
	ok(!res.failed)
	strictEqual(res.stderr, '')
	strictEqual(res.stdout, inspect(input, inspectOpts))
}

const tree = {
	foo: [{bar: 1}],
	_foo: [2, 3, 4, 5, [6]]
}

// no flags
const defOpts = {...inspect.defaultOptions, maxArrayLength: 2}
assertPrints(tree, '', defOpts)

// --depth/-d
assertFails(tree, '--depth')
assertFails(tree, '--depth foo')
assertPrints(tree, '--depth 1', {...defOpts, depth: 1})
assertPrints(tree, '--depth Infinity', {...defOpts, depth: Infinity})
assertFails(tree, '-d')
assertFails(tree, '-d foo')
assertPrints(tree, '-d 1', {...defOpts, depth: 1})
assertPrints(tree, '-d Infinity', {...defOpts, depth: Infinity})

// --color/-c
assertFails(tree, '--color foo')
assertPrints(tree, '--color', {...defOpts, colors: true})
assertPrints(tree, '--color false', {...defOpts, colors: false})
assertFails(tree, '-c foo')
assertPrints(tree, '-c', {...defOpts, colors: true})
assertPrints(tree, '-c false', {...defOpts, colors: false})

// --max-array-length/-a
assertFails(tree, '--max-array-length')
assertPrints(tree, '--max-array-length 1', {...defOpts, maxArrayLength: 1})
assertPrints(tree, '--max-array-length Infinity', {
	...defOpts, maxArrayLength: Infinity
})
assertFails(tree, '-a')
assertPrints(tree, '-a 1', {...defOpts, maxArrayLength: 1})
assertPrints(tree, '-a Infinity', {...defOpts, maxArrayLength: Infinity})

// --spacious/-c
assertFails(tree, '--spacious foo')
assertPrints(tree, '--spacious', {...defOpts, compact: false})
assertPrints(tree, '--spacious false', {...defOpts, compact: true})

// --sorted/-s
assertFails(tree, '--sorted foo')
assertPrints(tree, '--sorted', {...defOpts, sorted: true})
assertPrints(tree, '--sorted false', {...defOpts, sorted: false})
assertFails(tree, '-s foo')
assertPrints(tree, '-s', {...defOpts, sorted: true})
assertPrints(tree, '-s false', {...defOpts, sorted: false})
