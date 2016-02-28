# Nekochat
[![Build Status](https://img.shields.io/travis/ukatama/nekochat/master.svg?style=flat-square)](https://travis-ci.org/ukatama/nekochat)
[![Coverage Status](https://img.shields.io/coveralls/ukatama/nekochat.svg?style=flat-square)](https://coveralls.io/github/ukatama/nekochat)
[![PeerDependencies](https://img.shields.io/david/peer/ukatama/nekochat.svg?style=flat-square)](https://david-dm.org/ukatama/nekochat#info=peerDependencies&view=list)
[![Dependencies](https://img.shields.io/david/ukatama/nekochat.svg?style=flat-square)](https://david-dm.org/ukatama/nekochat)
[![DevDependencies](https://img.shields.io/david/dev/ukatama/nekochat.svg?style=flat-square)](https://david-dm.org/ukatama/nekochat#info=devDependencies&view=list)

Online chat made for Tabletop role-praing games.

## Changelog
See [CHANGELOG.md](https://github.com/ukatama/nekochat/blob/master/CHANGELOG.md)

## Installation
Just clone, install dependencies and run building task.
```bash
$ git clone --recursive https://github.com/ukatama/nekochat.git
$ cd nekochat
$ npm install
$ npm run build
```

## Usage
You can run as a Node.js standalone server.
```bash
$ node lib/server
```

## For Developers
Fllowing gulp tasks are availavle.
* `build`: Build with babel and browserify.
* `lint`: Lint with ESLint.
* `test`: Test and lint with Jest and ESLint.
* `serve`: Run server. 
* `watch`: Watch changes and runs `serve`, `build` and `test`.


## License
MIT License
