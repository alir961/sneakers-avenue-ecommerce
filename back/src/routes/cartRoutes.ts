import express from 'express';
import {Cart} from '../schema/cart/cart.model';
import {authenticateMiddleware} from '../services/authentication';
import mongoose from 'mongoose';

const router = express.Router();
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

router.post('/api/cart', async (req, res) => {
    try {
        const { userId, productId, name, price, quantity, image } = req.body;

        if (!userId || !productId || !name || !image || typeof price !== 'number' || typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ message: 'Invalid data' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.productId.equals(productId));

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, name, price, quantity, image });
        }

        await cart.save();

        res.status(200).json(cart);

    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/api/cart/:userId', authenticateMiddleware, async (req, res) => {
    const { userId } = req.params;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export {router as cartRouter};
