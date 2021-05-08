import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory();

  const handleLoginClick = () => {
    history.push('/');
  };

  return (
    <>
      <Helmet>
        <title>ログインページ</title>
        <meta name="description" content="loginpage" />
      </Helmet>
      <button onClick={() => handleLoginClick()}>ログイン</button>
    </>
  );
};

export { Login };
