import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../api/authApi';

const clientId = '1000411419171-3qtqn2et06fi0jrsbjghen8qqfkhu1u8.apps.googleusercontent.com';

const GoogleLoginButton: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;

    if (!credential) {
      console.error('No credential received');
      return;
    }

    try {
      const data = await googleLogin(credential);
      login(data.token, data.refreshToken, {
        id: data.user._id,
        login: data.user.login,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
      });
      navigate('/');
    } catch (error) {
      console.error('Error during Google login', error);
    }
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
