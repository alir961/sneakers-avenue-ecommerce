import {CSSProperties, useState} from 'react';
import InputText from './common/InputText';
import {IProfile} from '../screens/ProfileScreen';
import {handleFormSubmit} from '../common/profile';

interface ProfileComponentProperties {
  user: IProfile;
}

function ProfileComponent(props: ProfileComponentProperties) {
  const [error, setError] = useState(null as string);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(props.user);

  const wrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '500px',
    margin: '0 auto 25px auto',
  };
  const inputsStyle: CSSProperties = {
    width: '100%',
    marginBottom: 15,
  };

  function saveProfile() {
    setIsEditing(false);
    setError(null);
    handleFormSubmit(user)
      .catch(reason => {console.log(reason); setError(reason.message);});
  }

  return (
    <div style={wrapperStyle}>
      <div style={inputsStyle}>
        <InputText type={'text'} disabled={!isEditing} value={user.firstName}
                   callback={value => user.firstName = value}/>
        <InputText type={'text'} disabled={!isEditing} value={user.lastName} callback={value => user.lastName = value}/>
        <InputText type={'email'} disabled={!isEditing} value={user.email} callback={value => user.email = value}/>
      </div>

      {!isEditing && <button className="buttonStyle" onClick={() => setIsEditing(true)}>Edit</button>}
      {isEditing && <button className="buttonStyle" onClick={() => saveProfile()}>Save</button>}
      {error && <p style={{textAlign: 'center', color: '#f33', fontWeight: 'bold', fontSize: '20px'}}>{error}</p>}
    </div>
  );
}

export default ProfileComponent;
