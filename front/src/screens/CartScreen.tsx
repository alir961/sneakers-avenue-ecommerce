import React, {CSSProperties, useEffect, useState} from 'react';
import axios from 'axios';
import { getUserId } from '../common/profile';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/common/NavigationBar';
import {getAuthorizedHeader} from "../common/auth";
import '../index.css';
import Footer from "../components/FooterComponent";

type CartItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

function CartScreen(): React.JSX.Element {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null as string);
    const [userId, setUserId] = useState(null as string);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await getUserId();
                setUserId(id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
                setError('Error fetching user ID');
            }
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId === null) {
            return;
        }

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

    const handleIncreaseQuantity = async (productId: string) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/cart/${userId}/increase`, { productId }, {
                headers: getAuthorizedHeader(),
            });
            setCartItems((prevItems) =>
                prevItems.map((item) => item.productId === productId ? {...item, quantity: item.quantity + 1} : item)
            );
        } catch (error) {
            console.error('Error increasing quantity:', error);
            setError('Error increasing quantity : ' + error.response.data.message);
        }
    };

    const handleDecreaseQuantity = async (productId: string) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/cart/${userId}/decrease`, { productId }, {
                headers: getAuthorizedHeader(),
            });
            setCartItems((prevItems) =>
                prevItems
                    .map((item) => (item.productId === productId ? {...item, quantity: item.quantity - 1} : item))
                    .filter((item) => item.quantity > 0)
            );
        } catch (error) {
            console.error('Error decreasing quantity:', error);
            setError('Error decreasing quantity : ' + error.response.data.message);
        }
    };

    const handleRemoveItem = async (productId: string) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/${userId}/${productId}`, {
                headers: getAuthorizedHeader(),
            });
            setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
        } catch (error) {
            console.error('Error removing item:', error);
            setError('Error removing item : ' + error.response.data.message);
        }
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const buttonContainerStyle: CSSProperties = {
        margin: 'auto',
    };

    const containerStyle: CSSProperties = {
        textAlign: 'center',
        overflowX: 'hidden',
    };

    const subContainerStyle: CSSProperties = {
        padding: '8px',
    };

    const titleStyle: CSSProperties = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#333',
        textAlign: 'center',
        position: 'relative',
    };

    const paragraphStyle: CSSProperties = {
        fontSize: '1.2rem',
        lineHeight: '1.6',
        color: '#555',
        textAlign: 'center',
        margin: '0 auto',
        maxWidth: '800px',
        padding: '0 15px',
    };

    if (loading) {
        return <p>Loading cart...</p>;
    }

    return (
        <div style={containerStyle}>
            <NavigationBar color={'black'}/>

            <h1>Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div style={subContainerStyle} key={item.productId}>
                            <h2 style={titleStyle}>{item.name}</h2>
                            {item.image && <img src={item.image} alt={item.name} style={{ width: '100px' }} />}
                            <p style={paragraphStyle}>Quantity: {item.quantity}</p>
                            <p style={paragraphStyle}>Price: ${item.price.toFixed(2)}</p>
                            <div style={buttonContainerStyle} className={'buttonContainerStyle'}>
                                <button className={'buttonStyle'} onClick={() => handleIncreaseQuantity(item.productId)}>+</button>
                                </div><div style={buttonContainerStyle} className={'buttonContainerStyle'}>
                                <button className={'buttonStyle'} onClick={() => handleDecreaseQuantity(item.productId)} disabled={item.quantity === 1}>-</button>
                                </div><div style={buttonContainerStyle} className={'buttonContainerStyle'}>
                                <button className={'buttonStyle'} onClick={() => handleRemoveItem(item.productId)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {cartItems.length > 0 && (
                <div style={containerStyle}>
                    <h3>Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
                    <div style={buttonContainerStyle} className={'buttonContainerStyle'}>
                        <button className={'buttonStyle'} onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
            {error && <p style={{textAlign: 'center', color: '#f33', fontWeight: 'bold', fontSize: '20px'}}>{error}</p>}
            <Footer/>
        </div>
    );
}

export default CartScreen;
