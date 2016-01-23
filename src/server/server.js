import { Server } from 'http';
import config from 'config';
import { app } from './app';

export const server = Server(app);

server.listen(config.get('app.server'), () => {
    const {
        address,
        family,
        port,
    } = server.address();
    const listeningOn = family === 'IPv6' ? `[${address}]` : address;

    console.log(`Listening on ${listeningOn}:${port}`);
});