import React, { useState, useEffect, CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    const [marginTop, setMarginTop] = useState('10%');

    const handleResize = () => {
        const windowHeight = window.innerHeight;
        if (windowHeight < 600) {
            setMarginTop('85%');
        } else if (windowHeight < 850) {
            setMarginTop('65%');
        } else {
            setMarginTop('10%');
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const footerStyle: CSSProperties = {
        backgroundColor: '#000000',
        color: '#fff',
        textAlign: 'center',
        padding: '2%',
        position: 'fixed',
        bottom: 0,
        width: '97%',
    };

    const additionalContentStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        width: 'auto',
        height: 'auto',
        flexWrap: 'wrap',
    };

    const iconContainer: CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2%',
    };

    return (
        <div style={{ marginTop }}>
            <footer style={footerStyle}>
                <div style={additionalContentStyle}>
                    <p><FontAwesomeIcon icon={faLocationDot} /> France</p>
                    <p>© 2024 SneakersAvenue, Inc. All Rights Reserved</p>
                    <p>Guides</p>
                    <p>Terms of Sale</p>
                    <p>Terms of Use</p>
                    <p>SneakersAvenue Privacy Policy</p>
                </div>
                <div style={iconContainer}>
                    <FontAwesomeIcon icon={faTwitter} size="2x" style={{ marginRight: '5%' }} />
                    <FontAwesomeIcon icon={faInstagram} size="2x" />
                </div>
            </footer>
        </div>
    );
};

export default Footer;
