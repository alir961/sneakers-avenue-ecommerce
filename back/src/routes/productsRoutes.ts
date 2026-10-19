import express from 'express';
import { Product } from '../schema/products/products.model';
import {adminMiddleware, authenticateMiddleware} from '../services/authentication';

const router = express.Router();

router.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/api/products', authenticateMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description, price, image } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Product name is required' });
        }

        if (!description) {
            return res.status(400).json({ message: 'Product description is required' });
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
            return res.status(400).json({ message: 'Product price must be a valid number' });
        }

        const newProduct = new Product({
            name,
            description,
            price: parsedPrice,
            image,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export {router as productsRouter};
