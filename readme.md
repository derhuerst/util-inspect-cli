# util-inspect-cli

**Use [`util.inspect`](https://nodejs.org/docs/latest-v10.x/api/util.html#util_util_inspect_object_options) from the command line.**

[![npm version](https://img.shields.io/npm/v/util-inspect-cli.svg)](https://www.npmjs.com/package/util-inspect-cli)
[![build status](https://api.travis-ci.org/derhuerst/util-inspect-cli.svg?branch=master)](https://travis-ci.org/derhuerst/util-inspect-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/util-inspect-cli.svg)
![minimum Node.js version](https://img.shields.io/node/v/util-inspect-cli.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installation

```shell
npm install util-inspect-cli
```


## Usage

```
Usage:
    util-inspect [options]
Options:
    see also https://nodejs.org/docs/latest-v10.x/api/util.html#util_util_inspect_object_showhidden_depth_colors
    --depth             -d  Number of nested levels to inspect. Pass
                            `Infinity` for infinite depth. Default: 2
    --max-array-length  -a  Number of array elements to inspect.
                            Pass `Infinity` to show all. Default: 100
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
```


## Contributing

If you have a question or need support using `util-inspect-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/util-inspect-cli/issues).
