import React, { CSSProperties, useState } from 'react';
import NavigationBar, { checkIfUserIsLoggedIn } from '../components/common/NavigationBar';
import { useNavigate } from 'react-router-dom';
import '../index.css';

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

function CartScreen(): React.JSX.Element {
    const isLoggedIn = checkIfUserIsLoggedIn();
    const navigate = useNavigate();

    // Example cart items
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: 1, name: 'Sneaker A', price: 50, quantity: 2 },
        { id: 2, name: 'Sneaker B', price: 75, quantity: 1 },
    ]);

    const handleIncreaseQuantity = (id: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecreaseQuantity = (id: number) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
                .filter((item) => item.quantity > 0) // remove item if quantity is 0
        );
    };

    const handleRemoveItem = (id: number) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
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

    return (
        <div style={containerStyle}>
            <NavigationBar color="black" />

            <div style={subContainerStyle}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        {cartItems.map((item) => (
                            <div key={item.id} style={{ textAlign: 'left', margin: '10px' }}>
                                <h2>{item.name}</h2>
                                <p>Price: ${item.price.toFixed(2)}</p>
                                <p>Quantity: {item.quantity}</p>
                                <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                                <button
                                    onClick={() => handleDecreaseQuantity(item.id)}
                                    disabled={item.quantity === 1}
                                >
                                    -
                                </button>
                                <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                            </div>
                        ))}
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div>
                        <h3>Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
                        <div style={buttonContainerStyle}>
                            <button onClick={() => navigate(isLoggedIn ? '/checkout' : '/authentication')}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartScreen;
