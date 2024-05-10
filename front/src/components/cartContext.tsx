import React, { createContext, useContext, useState } from 'react';

type Product = {
    _id: number;
    name: string;
    price: number;
    description: string;
};

type CartItem = {
    _id: number;
    name: string;
    price: number;
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: Product) => void;
};

const CartContext = createContext<CartContextType>({
    cart: [],
    addToCart: () => {return},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item._id === product._id);

            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                const newCartItem: CartItem = {
                    ...product,
                    quantity: 1,
                };
                return [...prevCart, newCartItem];
            }
        });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};
