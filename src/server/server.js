import { Server } from 'http';
import config from 'config';
import { app } from './app';
import { system as logger } from './logger';

export const server = new Server(app);

server.listen(config.get('server'), () => {
    const {
        address,
        family,
        port,
    } = server.address();
    const listeningOn = family === 'IPv6' ? `[${address}]` : address;

    logger.info(`Listening on ${listeningOn}:${port}`);
});
