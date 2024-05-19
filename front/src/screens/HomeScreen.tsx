import React, {CSSProperties, useEffect, useState} from 'react';
import NavigationBar, {checkIfUserIsLoggedIn} from '../components/common/NavigationBar';
import {useNavigate} from 'react-router-dom';
import '../index.css';
import Footer from "../components/FooterComponent";

function HomeScreen(): React.JSX.Element {
  const isLoggedIn = checkIfUserIsLoggedIn();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 550);

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

  const brandTitleStyle: CSSProperties = {
    fontSize: '5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: 'transparent',
    textAlign: 'center',
    position: 'relative',
    background: 'linear-gradient(to right, #5603BD, #009EFF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '2px 2px 20px rgba(0, 0, 0, 0.5)',
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 550);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
      <div style={containerStyle}>
        <NavigationBar color={'black'}/>
        <div style={subContainerStyle}>
          {!isMobile && <h1 style={brandTitleStyle}>Sneakers Avenue</h1>}
          <img alt={'Application logo'}
               src={'https://laced.imgix.net/products/6b908a9f-fb3f-48de-a26e-dbc6b54dfea7.jpg?auto=format&fit=crop&w=1200'}
               style={{width: '70%', height: 'auto', objectFit: 'cover', marginTop: '-21%', marginBottom: '-10%',}}/>

          <h1 style={titleStyle}>Simplify Your Shopping Experience with SneakersAvenue</h1>
          <p style={paragraphStyle}>
            Welcome to our premier sneakers shop, where you'll discover the latest trends and classic styles
            from top brands like Nike, Adidas, and Puma. Our curated collection features exclusive releases,
            limited editions, and iconic designs to elevate your sneaker game. With our expert team and
            seamless shopping experience, you're sure to find the perfect pair that matches your style and
            performance needs.</p>
          <div style={buttonContainerStyle} className={'buttonContainerStyle'}>
            <button className={'buttonStyle'} onClick={() => navigate(!isLoggedIn ? '/authentication' : '/profile')}>
              Join Us
            </button>
          </div>
        </div>
        <div>
          <h1 style={titleStyle}>Every thing work better with Style</h1>
          <p style={paragraphStyle}>Discover all of the products we sell</p>
          <div style={buttonContainerStyle} className={'buttonContainerStyle'}>
            <button className={'buttonStyle'} onClick={() => navigate('/product')}>
              Our Products
            </button>
          </div>
        </div>
        <Footer/>
      </div>
  );
}

export default HomeScreen;
