import express from 'express';
import {Cart} from '../schema/cart/cart.model';
import {Product} from '../schema/products/products.model';
import {authenticateMiddleware, ownResourceMiddleware} from '../services/authentication';
import mongoose, {Types} from 'mongoose';

const router = express.Router();
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

router.post('/api/cart', authenticateMiddleware, ownResourceMiddleware, async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !isValidObjectId(productId) || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: 'Invalid data' });
        }

        // Name, price and image come from the catalog, never from the client.
        const product = await Product.findById(productId).exec();
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const { name, price, image } = product;

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

router.get('/api/cart/:userId', authenticateMiddleware, ownResourceMiddleware, async (req, res) => {
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

router.put('/api/cart/:userId/increase', authenticateMiddleware, ownResourceMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'User ID and Product ID are required' });
        }
        
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.productId.equals(productId));
        if (item) {
            item.quantity += 1;
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();

        res.status(200).json(cart);

    } catch (error) {
        console.error('Error increasing quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/api/cart/:userId/decrease', authenticateMiddleware, ownResourceMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'User ID and Product ID are required' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        const item = cart.items.find(item => item.productId.equals(productId));
        if (item) {
            if (item.quantity > 1)
                item.quantity -= 1;
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();

        res.status(200).json(cart);

    } catch (error) {
        console.error('Error decreasing quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/api/cart/:userId/:productId', authenticateMiddleware, ownResourceMiddleware, async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'User ID and Product ID are required' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.equals(new Types.ObjectId(productId)));
        if (itemIndex !== -1) {
            cart.items.splice(itemIndex, 1);
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();

        res.status(200).json(cart);

    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export {router as cartRouter};
