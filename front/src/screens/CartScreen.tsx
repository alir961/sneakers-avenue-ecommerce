import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserId } from '../common/profile';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/common/NavigationBar';
import '../index.css';
import {getAuthorizedHeader} from "../common/auth";

type CartItem = {
    productId: string; // Refers to the Product ID
    name: string;
    price: number;
    quantity: number;
};

function CartScreen(): React.JSX.Element {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const userId = getUserId();
    console.log('ID : ' + userId);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart/${userId}`, {
                    headers: getAuthorizedHeader(),
                });
                const cart = response.data
                setCartItems(cart.items);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart:', error);
                setError('Error fetching cart : ' + error.response.data.message);
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [userId]);

    const handleIncreaseQuantity = (productId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
        );
    };

    const handleDecreaseQuantity = (productId: string) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item))
                .filter((item) => item.quantity > 0)
        );
    };

    const handleRemoveItem = (productId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    if (loading) {
        return <p>Loading cart...</p>;
    }

    return (
        <div>
            <NavigationBar color={'black'}/>

            <h1>Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.productId}>
                            <h2>{item.name}</h2>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <p>Quantity: {item.quantity}</p>
                            <button onClick={() => handleIncreaseQuantity(item.productId)}>+</button>
                            <button
                                onClick={() => handleDecreaseQuantity(item.productId)}
                                disabled={item.quantity === 1}
                            >
                                -
                            </button>
                            <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}

            {cartItems.length > 0 && (
                <div>
                    <h3>Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
                    <button onClick={() => navigate('/checkout')}>
                        Proceed to Checkout
                    </button>
                </div>
            )}
            {error && <p style={{textAlign: 'center', color: '#f33', fontWeight: 'bold', fontSize: '20px'}}>{error}</p>}
        </div>
    );
}

export default CartScreen;
