import { Server } from 'http';
import { app } from './app';

export const server = Server(app);

server.listen(80, function() {
    let {
        address,
        family,
        port,
    } = server.address();
    console.log(`Listening on ${family == 'IPv6' ? `[${address}]` : address}:${port}`);
});