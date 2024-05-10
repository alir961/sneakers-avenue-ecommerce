import axios from 'axios';
import {IProfile} from '../screens/ProfileScreen';
import {NavigateFunction} from 'react-router-dom';
import {getAuthorizedHeader} from "./auth";
import Cookies from 'js-cookie';

function handleFormSubmit(profile: IProfile): Promise<void> {
  const {email, firstName, lastName} = profile;

  return axios.put(`${process.env.REACT_APP_API_URL}/api/profile`, {firstName, lastName, email},
      {
          headers: getAuthorizedHeader(),
      })
    .then(() => Promise.resolve())
    .catch(reason => Promise.reject(new Error('Unable to update profile: ' + reason.response.data.message)));
}

async function deleteAccount(navigate: NavigateFunction) {
  await axios.delete(`${process.env.REACT_APP_API_URL}/api/me`,
      {
          headers: getAuthorizedHeader(),
      });
  Cookies.remove('token');
  navigate('/authentication');
}

async function getUserId() {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/me`, {
        headers: getAuthorizedHeader(),
    });
    return response.data._id;
}

export {handleFormSubmit, deleteAccount, getUserId};
