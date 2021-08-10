import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { Container } from './style';

const Login = () => {
  const history = useHistory();

  const handleLoginClick = () => {
    (async () => {
      const signInRes = await window.gapi.auth2.getAuthInstance().signIn();
      if (!signInRes['error']) {
        history.push('/');
      }
    })();
  };

  return (
    <>
      <Helmet>
        <title>ログインページ</title>
        <meta name="description" content="login page" />
      </Helmet>
      <Container>
        <button onClick={() => handleLoginClick()}>ログイン</button>
      </Container>
    </>
  );
};

export { Login };
