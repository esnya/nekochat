import { Server } from 'http';
import AppConfig from '../config/app';
import { app } from './app';

export const server = Server(app);

server.listen(AppConfig.server, () => {
    let {
        address,
        family,
        port,
    } = server.address();

    console.log(`Listening on ${family === 'IPv6' ? `[${address}]` : address}:${port}`);
});