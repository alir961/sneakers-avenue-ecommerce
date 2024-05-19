import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faBars, faXmark} from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import './NavigationBar.css';
import {faBasketShopping} from "@fortawesome/free-solid-svg-icons/faBasketShopping";
import {faBagShopping} from "@fortawesome/free-solid-svg-icons/faBagShopping";
import {faHome} from "@fortawesome/free-solid-svg-icons/faHome";

export function checkIfUserIsLoggedIn(): boolean {
  const token = Cookies.get('token');

  return !!token;
}

interface INavigationBarProperties {
  color: string;
}

function NavigationBar(props: INavigationBarProperties): React.JSX.Element {
  const isLoggedIn = checkIfUserIsLoggedIn();
  const [menuDropDown, setMenuDropDown] = useState(false);

  return (
    <nav className={'navigation-container'} style={{backgroundColor: props.color}}>
      <div className={'mobile'}>
        <button onClick={() => setMenuDropDown(!menuDropDown)}>
          <FontAwesomeIcon icon={menuDropDown ? faXmark : faBars}/>
        </button>
      </div>
      <div className={'links'} style={{top: (menuDropDown ? '0' : '-1000px')}}>
          <Link to="/" className={'nav-link'}>Home  <FontAwesomeIcon icon={faHome}/></Link>
          <Link to="/product" className={'nav-link'}>Products <FontAwesomeIcon icon={faBagShopping}/></Link>
          {isLoggedIn && <Link to="/cart" className={'nav-link'}>Cart <FontAwesomeIcon icon={faBasketShopping}/></Link>}
          <Link to={isLoggedIn ? '/profile' : '/authentication'} className={'nav-icon'}>
                <FontAwesomeIcon icon={faUser}/>
          </Link>
      </div>
        <Link to={'/'} className={'text-link'}>
            <h1 className={'text-link-content'}>SneakersAvenue</h1>
        </Link>
    </nav>
  );
}

export default NavigationBar;
