import config, { util } from 'config';
import { readFile } from 'fs-promise';
import { request } from 'http';
import { platform } from 'os';
import { getLogger } from './logger';

const {
    enabled,
    ...etcd,
} = config.get('etcd');

if (enabled) {
    const logger = getLogger('[etcd]');
    const hosts = platform() === 'win32'
        ? `${process.env.SystemRoot}/System32/drivers/etc/hosts`
        : '/etc/hosts';

    const update = () => {
        logger.info('Updating ip address');

        readFile(hosts)
        .then((file) => {
            const address = file.toString()
                .split(/\r\n|\n/)
                .map((line) =>
                    line.replace(/\s\s+/, ' ')
                        .replace(/(#.*$)/, '')
                        .match(/^\s*([^\s]+)\s+(([^\s]+\s*)+)$/)
                )
                .filter((m) => m)
                .map((m) => [m[1], m[2].split(/\s+/)])
                .map((m) => m[1].indexOf(util.getEnv('HOSTNAME')) >= 0 && m[0])
                .find((a) => a);

            request({
                ...etcd,
                method: 'PUT',
                path: `/v2/keys/${config.get('name')}?value=${address}`,
            }, (res) => {
                const chunks = [];

                res.on('data', (chunk) => chunks.push(chunk));

                res.on('end', () => {
                    const body = Buffer.concat(chunks).toString('utf-8');

                    if (Math.floor(res.statusCode / 100) === 2) {
                        const data = JSON.parse(body);
                        logger.info(
                            'Addres of',
                            data.node.key,
                            'has been updated to',
                            data.node.value,
                            'from',
                            data.prevNode && data.prevNode.value || null
                        );
                    } else {
                        logger.error(body);
                    }
                });
            })
            .on('error', (e) => logger.error(e))
            .end();
        })
        .catch((e) => logger.error(e));
    };

    update();
    setInterval(update, 1000 * 60 * 10);
}