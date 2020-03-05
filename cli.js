#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'sorted', 's',
		'color', 'c',
		'spacious',
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    util-inspect [options]
Options:
    see also https://nodejs.org/docs/latest-v10.x/api/util.html#util_util_inspect_object_showhidden_depth_colors
    --depth             -d  Number of nested levels to inspect. Pass
                            \`Infinity\` for infinite depth. Default: 2
    --max-array-length  -a  Number of array elements to inspect.
                            Pass \`Infinity\` to show all. Default: 100
    --sorted            -s  Sort keys using Array.prototype.sort().
    --color             -c  Inspect with colors? Default: based on
                            terminal support
    --spacious              Don't use a compact layout.
Note:
    To select sub-trees of a JSON tree, use jq.
    https://stedolan.github.io/jq/
Examples:
    echo '{"foo": [{"bar": [1]}]}' | util-inspect --color
    echo '[[1, 2, 3, 4, 5]]' | jq '.[0]' | util-inspect -a Infinity
    echo '{"foo": 1, "_foo": 2}' | util-inspect --sorted
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`parse-url v${pkg.version}\n`)
	process.exit(0)
}

const {stdout: supportsColor} = require('supports-color')
const {inspect} = require('util')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const toBool = (name, shortHand, defaultVal) => {
	let res
	if (name in argv) res = argv[name]
	else if (shortHand && (shortHand in argv)) res = argv[shortHand]
	else return defaultVal

	if ('boolean' !== typeof res) {
		const n = `--${name}${shortHand ? '-' + shortHand : ''}`
		showError(n + ' must be a boolean.')
	}
	return res
}

const toInt = (name, shortHand, defaultVal) => {
	let res
	if (name in argv) res = argv[name]
	else if (shortHand && (shortHand in argv)) res = argv[shortHand]
	else return defaultVal

	if (res === 'Infinity') return Infinity
	if (!Number.isInteger(res)) {
		const n = `--${name}${shortHand ? '/-' + shortHand : ''}`
		showError(n + ' must be an integer or `Infinity`.')
	}
	return res
}

const opt = {
	depth: toInt('depth', 'd', 2),
	colors: toBool('color', 'c', supportsColor),
	maxArrayLength: toInt('max-array-length', 'a', 2),
	// todo: breakLength
	compact: !argv.spacious,
	sorted: toBool('sorted', 's', false),
}

let val = ''
process.stdin.on('data', (chunk) => {
	val += chunk.toString('utf8')
})

process.stdin.once('error', showError)
process.stdin.once('end', () => {
	try {
		val = JSON.parse(val)
	} catch (err) {
		err.input = val
		throw err
	}

	process.stdout.end(inspect(val, opt))
})
