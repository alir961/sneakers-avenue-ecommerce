import {MongoMemoryServer} from 'mongodb-memory-server';

// Runs once before all suites: an in-memory MongoDB, so tests need no local database.
export default async function globalSetup() {
    const server = await MongoMemoryServer.create();
    (globalThis as any).__MONGO__ = server;
    process.env.MONGODB_URI = server.getUri('sneakers-test');
    process.env.ACCESS_TOKEN_SECRET = 'test-only-secret';
    process.env.PASSWORD_CONDITIONS = '8+ characters with a special character';
}
