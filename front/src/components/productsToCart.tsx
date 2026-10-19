import axios from 'axios';
import {getAuthorizedHeader} from "../common/auth";
import {IProduct} from "../screens/ProductScreen";

const addToCart = async (product: IProduct, quantity = 1): Promise<void> => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/me`, {
        headers: getAuthorizedHeader(),
    });
    const userId = response.data._id;

    if (!userId) {
        throw new Error('User ID is required to add to cart');
    }

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/cart`, {
            userId,
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
        }, {
            headers: getAuthorizedHeader(),
        });

        const updatedCart = response.data;
        console.log('Updated cart:', updatedCart);

    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error;
    }
};

export {addToCart};
