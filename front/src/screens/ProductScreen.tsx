import React, { useState, useEffect, CSSProperties } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../components/productsToCart';
import NavigationBar, {checkIfUserIsLoggedIn} from '../components/common/NavigationBar';
import {getAuthorizedHeader} from "../common/auth";
import Modal, {Styles} from 'react-modal';
import '../index.css';

interface IProduct {
    _id: number;
    name: string;
    price: number;
    description: string;
    image: string;
}

const ProductScreen: React.FC = () => {
    const navigate = useNavigate();
    const isLoggedIn = checkIfUserIsLoggedIn();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null as string);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0,
        image: '',
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load products : ' + error.response.data.message);
                setLoading(false);
            }
        };
        fetchProducts().catch(reason => console.log(reason));
    }, []);

    async function checkIfUserIsAdmin() {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/me/status`, {
            headers: getAuthorizedHeader(),
        });

        return(response?.data);
    }

    useEffect(() => {
        const fetchAdminStatus = async () => {
            if (isLoggedIn) {
                try {
                    const isAdmin = await checkIfUserIsAdmin();
                    setIsAdmin(isAdmin);
                } catch (error) {
                    console.error('Error checking admin status:', error);
                }
            }
        };
        fetchAdminStatus();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/products`,
                newProduct
            );
            setProducts((prev) => [...prev, response.data]);
            setIsModalOpen(false);
            setNewProduct({ name: '', description: '', price: 0, image: '' });
        } catch (error) {
            setError('Failed to create product : ' + error.response.data.message);
        }
    };

    const buttonContainerStyle: CSSProperties = {
        margin: 'auto',
    };

    const containerStyle: CSSProperties = {
        textAlign: 'center',
        overflowX: 'hidden',
    };

    const productCardStyle: CSSProperties = {
        padding: '2%',
        margin: '2%',
    };

    const modalStyle: Styles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
        content: {
            margin: 'auto',
            width: '50%',
            textAlign: 'left',
            marginTop: '2%',
        },
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

    return (
        <div style={containerStyle}>
            <NavigationBar color="black" />

            <h1 style={titleStyle}>Available Products</h1>

            {isAdmin && <div style={buttonContainerStyle} className={'buttonContainerStyle'}>
                <button className={'buttonStyle'} onClick={() => setIsModalOpen(true)}>
                    Add New Product
                </button>
            </div>}

            {loading ? (
                <p>Loading products...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '80%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5%' }}>
                    {products.map((product) => (
                        <div key={product._id} className={'productCardStyle'} style={productCardStyle}>
                            <h2 style={titleStyle}>{product.name}</h2>
                            {product.image && <img src={product.image} alt={product.name} style={{ width: '100px' }} />}
                            <p style={paragraphStyle}>{product.description}</p>
                            <p style={paragraphStyle}>Price: ${product.price.toFixed(2)}</p>
                            <div style={buttonContainerStyle} className={'buttonContainerStyle'}>
                                {isLoggedIn && <button className={'buttonStyle2'} onClick={() => addToCart(product)}>
                                    Add to Cart
                                </button>}
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            )}

            <div style={buttonContainerStyle} className={'buttonContainerStyle'}>
                {isLoggedIn && <button className={'buttonStyle'} onClick={() => navigate('/cart')}>
                    Go to Cart
                </button>}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Add New Product"
                appElement={document.getElementById('root')}
                style={modalStyle}
            >
                <h2 style={titleStyle}>Add New Product</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="inputStyle"
                />
                <textarea
                    name="description"
                    placeholder="Product Description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    className="inputStyle"
                    style={{ resize: 'none' }}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Product Price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="inputStyle"
                />
                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={handleInputChange}
                    className="inputStyle"
                />
                <div style={buttonContainerStyle} className={'buttonContainerStyle'}>
                    <button className={'buttonStyle'} onClick={handleSubmit}>
                        Create
                    </button>
                </div>
                <div style={buttonContainerStyle} className={'buttonContainerStyle'}>
                    <button className={'buttonStyle'} onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </button>
                </div>
                    {error && <p style={{
                        textAlign: 'center',
                        color: '#f33',
                        fontWeight: 'bold',
                        fontSize: '20px'
                    }}>{error}</p>}
            </Modal>
        </div>
);
};

export {IProduct};
export default ProductScreen;
