import { Server } from 'http';
import AppConfig from '../config/app';
import { app } from './app';

export const server = Server(app);

server.listen(AppConfig.server, () => {
    const {
        address,
        family,
        port,
    } = server.address();
    const listeningOn = family === 'IPv6' ? `[${address}]` : address;

    console.log(`Listening on ${listeningOn}:${port}`);
});