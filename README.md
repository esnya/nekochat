# Nekochat
[![Build Status](https://img.shields.io/travis/ukatama/nekochat/master.svg?style=flat-square)](https://travis-ci.org/ukatama/nekochat)
[![Coverage Status](https://img.shields.io/coveralls/ukatama/nekochat.svg?style=flat-square)](https://coveralls.io/github/ukatama/nekochat)
[![PeerDependencies](https://img.shields.io/david/peer/ukatama/nekochat.svg?style=flat-square)](https://david-dm.org/ukatama/nekochat#info=peerDependencies&view=list)
[![Dependencies](https://img.shields.io/david/ukatama/nekochat.svg?style=flat-square)](https://david-dm.org/ukatama/nekochat)
[![DevDependencies](https://img.shields.io/david/dev/ukatama/nekochat.svg?style=flat-square)](https://david-dm.org/ukatama/nekochat#info=devDependencies&view=list)

Online chat for tabletop role-praing games.

## Changelog
See [CHANGELOG.md](https://github.com/ukatama/nekochat/blob/master/CHANGELOG.md)

## As a Docker Container
### Build

```bash
$ git clone --recursive https://github.com/ukatama/nekochat.git
$ docker build -t ukatama/nekochat nekochat
```

### Config
```bash
$ vi /path/to/nekochat/config.yml
$ cat /path/to/nekochat/config.yml
app:
    secret: <any secret value>
redis:
    host: redis
```

### Run
```bash
$ docker run -d --name redis --env redis
$ docker run -d --name nekochat -p 80:80 --env NODE_ENV=production --link redis:redis -v /path/to/nekochat/config.yml:/usr/src/app/config/local.yml:ro ukatama/nekochat
```

## As a Node.js application
### Build
```bash
$ git clone --recursive https://github.com/ukatama/nekochat.git
$ cd nekochat
$ npm install
$ npm run build
```

### Config
You should set the value of `app.secret`.
```bash
$ vi config/local.yml
$ cat config/local.yml
app:
    secret: <any secret value>
```

### Run
```bash
$ npm start
```

## Config
Edit `config/local.yml`.

Default values are specified by [`config/default.yml`](https://github.com/ukatama/nekochat/blob/master/config/default.yml) and  [`config/production.yml`](https://github.com/ukatama/nekochat/blob/master/config/production.yml)
See also [node-config](https://github.com/lorenwest/node-config) abtout the configuration system.

| Key              | type    | descrption                                                       |
|------------------|---------|------------------------------------------------------------------|
| name             | string  | Name of the application instance.                                |
| app.guest        | boolean | Set `true` to allow guest login.                                 |
| app.livereload   | boolean | Set `true` to enable livereload scrpit to develop.               |
| app.secret       | string  | Secret value for sessions.                                       |
| browser.debug    | boolean | Set `true` to enable client debugging mode.                      |
| database.default | object  | Default database configurations. See also [Knex.js](http://knexjs.org/#Installation-client). |
| database.session | object  | Session database configurations. This is only used `session.store` is set to `database`. |
| redis            | object  | Redis client (`createClient()`) configuratios. See also [node_redis#redis.createClient()](https://github.com/NodeRedis/node_redis#rediscreateclient) |
| server.host      | string  | Host address to bind.                                            |
| server.port      | number  | Port number to bind.                                             |
| session          | object  | See also [express-session](https://github.com/expressjs/session) |
| session.store    | string  | Type of session store. `database` or `redis`                     |

## License
MIT License
