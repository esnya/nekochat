import { Server } from 'http';
import config from 'config';
import { getLogger } from 'log4js';
import { app } from './app';

const logger = getLogger('[SERVER]');

export const server = Server(app);

server.listen(config.get('server'), () => {
    const {
        address,
        family,
        port,
    } = server.address();
    const listeningOn = family === 'IPv6' ? `[${address}]` : address;

    logger.info(`Listening on ${listeningOn}:${port}`);
});
