import React from 'react';
import Button from '@mui/material/Button';

import { googleLogin } from './OAuth';
import { githubLogin } from './OAuth';

const OAuthButton = ({ provider, logo, onClick }) => {
  return (
    <Button variant="contained"
    onClick={onClick}
    sx={{
      backgroundColor: 'white',
      color: 'gray',
      fontWeight: '500',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '150px', 
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: '#f3f4f6',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
    }}
  >
    <span style={{ marginRight: '16px' }}>{logo}</span>
    <span style={{ fontSize: '1rem' }}>{provider}</span>
  </Button>
  );
};

  const OAuthLoginButtons = () => {
    const onGoogleLogin = googleLogin;
    const onGithubLogin = githubLogin;
    return (
      <div
      style={{
        display: 'flex',
        flexDirection: 'column',  
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1vh'
      }}>
      <OAuthButton 
        provider="Google" 
        logo={<GoogleLogo />} 
        onClick={onGoogleLogin} 
      />
      <OAuthButton 
        provider="Github" 
        logo={<GithubLogo />} 
        onClick={onGithubLogin} 
      />
    </div>
    );
  };
  

  const GoogleLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
  
  const GithubLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" fill="#24292F" />
    </svg>
  );

  
  export default OAuthLoginButtons;