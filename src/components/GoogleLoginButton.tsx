import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const clientId = '1000411419171-3qtqn2et06fi0jrsbjghen8qqfkhu1u8.apps.googleusercontent.com';

const GoogleLoginButton: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;

    if (!credential) {
      console.error('No credential received');
      return;
    }

    fetch('http://localhost:3000/google-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: credential })
    })
      .then(res => res.json())
      .then(data => {
        login(data.token, data.refreshToken, {
          id: data.user.id,
          login: data.user.login,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role,
        });
        navigate('/');
      })
      .catch(error => {
        console.error('Error during Google login', error);
      });
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
