import axios from 'axios';
import Cookies from 'js-cookie';
import {NavigateFunction} from 'react-router-dom';

function getAuthorizedHeader() {
  return {'Authorization': `Bearer ${Cookies.get('token')}`};
}

function logout(navigate: NavigateFunction) {
  axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {}, {headers: getAuthorizedHeader()})
    .catch(reason => console.warn('Unable to logout: ', reason))
    .finally(() => {
      Cookies.remove('token');
      navigate('/authentication');
    });
}

export {logout, getAuthorizedHeader};
