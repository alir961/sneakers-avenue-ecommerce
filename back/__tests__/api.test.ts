import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import {User} from '../src/schema/users/users.model';
import {Product} from '../src/schema/products/products.model';

const PASSWORD = 'Sneak3rs!pass';

async function signUp(email: string): Promise<{token: string; id: string}> {
    const registered = await request(app).post('/api/auth/register').send({email, password: PASSWORD});
    expect(registered.status).toBe(201);
    const login = await request(app).post('/api/auth/login').send({email, password: PASSWORD});
    expect(login.status).toBe(200);
    return {token: login.body.token, id: registered.body._id};
}

const auth = (token: string) => ({Authorization: `Bearer ${token}`});

function decodeJwt(token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
}

const sneaker = {name: 'Air Max 90', description: 'Classic runner', price: 140, image: 'airmax.png'};

beforeAll(() => mongoose.connection.asPromise());
afterAll(() => mongoose.disconnect());

describe('Authentication', () => {
    test('register rejects missing fields and weak passwords', async () => {
        expect((await request(app).post('/api/auth/register').send({email: 'a@b.co'})).status).toBe(400);
        expect((await request(app).post('/api/auth/register')
            .send({email: 'weak@test.com', password: 'short'})).status).toBe(403);
    });

    test('register refuses an existing email', async () => {
        await signUp('dup@test.com');
        const again = await request(app).post('/api/auth/register').send({email: 'dup@test.com', password: PASSWORD});
        expect(again.status).toBe(403);
    });

    test('login rejects a wrong password', async () => {
        await signUp('wrong@test.com');
        const res = await request(app).post('/api/auth/login').send({email: 'wrong@test.com', password: 'Nope!nope1'});
        expect(res.status).toBe(403);
    });

    test('login and register reject query operators instead of strings', async () => {
        await signUp('operator@test.com');
        const login = await request(app).post('/api/auth/login').send({email: {$ne: null}, password: PASSWORD});
        expect(login.status).toBe(400);
        const register = await request(app).post('/api/auth/register').send({email: {$gt: ''}, password: PASSWORD});
        expect(register.status).toBe(400);
    });

    test('protected routes need a valid token', async () => {
        expect((await request(app).get('/api/me')).status).toBe(401);
        expect((await request(app).get('/api/me').set(auth('forged.token.value'))).status).toBe(401);
    });
});

describe('Sensitive data is never exposed', () => {
    test('the password hash is not in the register response, the token or /api/me', async () => {
        const email = 'private@test.com';
        const registered = await request(app).post('/api/auth/register').send({email, password: PASSWORD});
        expect(registered.body).not.toHaveProperty('password');

        const {token} = (await request(app).post('/api/auth/login').send({email, password: PASSWORD})).body;
        expect(JSON.stringify(decodeJwt(token))).not.toContain('password');

        const me = await request(app).get('/api/me').set(auth(token));
        expect(me.status).toBe(200);
        expect(me.body.email).toBe(email);
        expect(me.body).not.toHaveProperty('password');
    });
});

describe('Products', () => {
    test('anyone can list products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('only admins can create products', async () => {
        expect((await request(app).post('/api/products').send(sneaker)).status).toBe(401);

        const customer = await signUp('customer@test.com');
        expect((await request(app).post('/api/products').set(auth(customer.token)).send(sneaker)).status).toBe(403);

        const admin = await signUp('admin@test.com');
        await User.updateOne({email: 'admin@test.com'}, {isAdmin: true});
        const created = await request(app).post('/api/products').set(auth(admin.token)).send(sneaker);
        expect(created.status).toBe(201);
        expect(created.body.name).toBe(sneaker.name);
    });
});

describe('Profile', () => {
    test('an email already used by another account is refused', async () => {
        await signUp('taken@test.com');
        const {token} = await signUp('mover@test.com');
        const res = await request(app).put('/api/profile').set(auth(token))
            .send({email: 'taken@test.com', firstName: 'A', lastName: 'B'});
        expect(res.status).toBe(409);
        const same = await request(app).put('/api/profile').set(auth(token))
            .send({email: 'mover@test.com', firstName: 'A', lastName: 'B'});
        expect(same.status).toBe(200);
    });

    test('deleting the account also deletes its cart', async () => {
        const {token, id} = await signUp('leaving@test.com');
        const product = await Product.create(sneaker);
        await request(app).post('/api/cart').set(auth(token)).send({userId: id, productId: product._id, quantity: 1});
        expect((await request(app).delete('/api/me').set(auth(token))).status).toBe(200);
        const {Cart} = await import('../src/schema/cart/cart.model');
        expect(await Cart.countDocuments({userId: id})).toBe(0);
    });
});

describe('Cart', () => {
    let productId: string;
    const item = (userId: string) => ({userId, productId, quantity: 1});

    beforeAll(async () => {
        productId = (await Product.create(sneaker))._id.toString();
    });

    test('name, price and image come from the catalog, not the client', async () => {
        const {token, id} = await signUp('cheap@test.com');
        const res = await request(app).post('/api/cart').set(auth(token))
            .send({...item(id), name: 'Free shoes', price: 0.01, image: 'evil.png'});
        expect(res.status).toBe(200);
        expect(res.body.items[0]).toMatchObject({name: sneaker.name, price: sneaker.price, image: sneaker.image});
    });

    test('adding an unknown product is refused', async () => {
        const {token, id} = await signUp('ghost@test.com');
        const unknown = new mongoose.Types.ObjectId().toString();
        const res = await request(app).post('/api/cart').set(auth(token)).send({userId: id, productId: unknown, quantity: 1});
        expect(res.status).toBe(404);
    });

    test('full cart flow for its owner', async () => {
        const {token, id} = await signUp('owner@test.com');

        let res = await request(app).post('/api/cart').set(auth(token)).send(item(id));
        expect(res.status).toBe(200);
        res = await request(app).put(`/api/cart/${id}/increase`).set(auth(token)).send({productId});
        expect(res.body.items[0].quantity).toBe(2);
        res = await request(app).put(`/api/cart/${id}/decrease`).set(auth(token)).send({productId});
        expect(res.body.items[0].quantity).toBe(1);
        res = await request(app).get(`/api/cart/${id}`).set(auth(token));
        expect(res.status).toBe(200);
        res = await request(app).delete(`/api/cart/${id}/${productId}`).set(auth(token));
        expect(res.body.items).toHaveLength(0);
    });

    test('adding to a cart requires authentication', async () => {
        const {id} = await signUp('anon-target@test.com');
        expect((await request(app).post('/api/cart').send(item(id))).status).toBe(401);
    });

    test("a user cannot read or modify someone else's cart (IDOR)", async () => {
        const victim = await signUp('victim@test.com');
        const attacker = await signUp('attacker@test.com');
        await request(app).post('/api/cart').set(auth(victim.token)).send(item(victim.id));

        const asAttacker = auth(attacker.token);
        expect((await request(app).get(`/api/cart/${victim.id}`).set(asAttacker)).status).toBe(403);
        expect((await request(app).post('/api/cart').set(asAttacker).send(item(victim.id))).status).toBe(403);
        expect((await request(app).put(`/api/cart/${victim.id}/increase`).set(asAttacker).send({productId})).status).toBe(403);
        expect((await request(app).delete(`/api/cart/${victim.id}/${productId}`).set(asAttacker)).status).toBe(403);
    });
});
