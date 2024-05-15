import React, {CSSProperties} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";

const Footer = () => (
    <footer style={footerStyle}>
        <div style={additionalContentStyle}>
            <p><FontAwesomeIcon icon={faLocationDot}/> France</p>
            <p>© 2024 SneakersAvenue, Inc. All Rights Reserved</p>
            <p>Guides</p>
            <p>Terms of Sale</p>
            <p>Terms of Use</p>
            <p>SneakersAvenue Privacy Policy</p>
        </div>
        <div style={iconContainer}>
            <FontAwesomeIcon icon={faTwitter} size="2x" style={{marginRight: '5%'}}/>
            <FontAwesomeIcon icon={faInstagram} size="2x"/>
        </div>
    </footer>
);

const footerStyle: CSSProperties = {
    backgroundColor: '#000000',
    color: '#fff',
    textAlign: 'center',
    padding: '2%',
};

const additionalContentStyle: CSSProperties = {
    marginTop: '20px',
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

export default Footer;
