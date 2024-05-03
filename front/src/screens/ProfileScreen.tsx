import React, {CSSProperties, useEffect, useState} from 'react';
import NavigationBar from '../components/common/NavigationBar';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import ProfileComponent from '../components/ProfileComponent';
import {deleteAccount} from '../common/profile';
import {logout, getAuthorizedHeader} from '../common/auth';
import './ProfileScreen.css';

interface IProfile {
  email: string;
  firstName: string;
  lastName: string;
}

interface ProfileContentProperties {
  profile: IProfile;
}

function ProfileContent(props: ProfileContentProperties): React.JSX.Element {
  const {profile} = props;
  const navigate = useNavigate();

  if (profile === null) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  } else {
    const buttonStyle: CSSProperties = {
      marginTop: '10px',
      marginBottom: '10px',
    };

    return (
      <div>
        <ProfileComponent user={profile}/>

        <div className={'account-actions'}>
          <button type={'button'}
                  onClick={() => logout(navigate)}
                  className="buttonStyle"
                  style={buttonStyle}>
            Logout
          </button>

          <button type={'button'}
                  onClick={async () => await deleteAccount(navigate)}
                  className="buttonStyle"
                  style={{...buttonStyle, backgroundColor: '#f22'}}>
            Delete account
          </button>
        </div>
      </div>
    );
  }
}

function ProfileScreen(): React.JSX.Element {
  const titleStyle: CSSProperties = {
    margin: '25px 0',
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold',
  };
  const profileContainerStyle: CSSProperties = {
    margin: 'auto',
    minHeight: '70%',
  };

  const [profile, setProfile] = useState(null as IProfile);

  async function updateUserData() {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/me`, {
      headers: getAuthorizedHeader(),
    });

    setProfile(response?.data);
  }

  useEffect(() => {
    updateUserData()
      .catch(reason => console.warn(reason));
  }, []);

  return (
    <div>
      <NavigationBar color={'black'}/>

      <div>
        <h6 style={titleStyle}>My Profile</h6>

        <div style={profileContainerStyle} className={'profile-container'}>
          <ProfileContent profile={profile}/>
        </div>
      </div>
    </div>
  );
}

export type {IProfile};
export default ProfileScreen;
