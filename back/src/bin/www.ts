#!/usr/bin/env node

import app from '../app';
import debugLib from 'debug';
import http, { Server } from 'http';
import { AddressInfo } from 'net';

const debug = debugLib('back:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '9000');
app.set('port', port);
/**
 * Create HTTP server.
 */

const server: Server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string | number): number | string | false {
    const port = parseInt(String(val), 10);

    if (isNaN(port)) {
        return val; // If not a number, return as-is (named pipe)
    }

    return port >= 0 ? port : false; // Return valid port number or false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    switch (error.code) {
    case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
    const addr = server.address() as AddressInfo; // AddressInfo is used to provide type
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
    console.log(`The server started successfully on ${bind}`);
    console.log(`Access it via http://localhost:${addr.port}/api`);
}
