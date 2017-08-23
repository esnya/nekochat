/* eslint no-console: off */

const { spawn } = require('child_process');
const config = require('config');

const aliases = {
    maria: 'mariasql',
    madiadb: 'mariasql',
    postgres: 'pq',
    postgresql: 'pq',
    sqlite: 'sqlite3',
};

const clientConf = config.get('database.default.client');
const client = aliases[clientConf] || clientConf;

try {
    console.log('checking module', client);

    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(client);

    console.log(client, 'is already installed.');
} catch (e) {
    console.log(client, 'is not installed.');

    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    console.log('> npm install', client);
    const child = spawn(
        npm,
        ['install', client],
        { stdio: 'inherit' },
    );
    child.on('exit', code => process.exit(code));
}
