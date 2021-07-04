import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { NotFoundPage } from 'app/components/NotFoundPage';
declare global {
  interface Window {
    gapi: any;
  }
}

type Props = {
  exact: boolean;
  path?: string;
  component: any;
  requiresAuth: boolean;
};

const BeforeRenderRoute: React.FC<Props> = ({
  exact,
  path,
  component,
  requiresAuth,
}) => {
  // googleApiのロードがされていなかった場合、ロードする
  if (window.gapi) {
    // 認証が必要ならページなら認証情報をチェック
    console.debug('認証情報チェック');
    const isSignIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
    // 認証済状態でログイン画面に遷移した際はホーム画面へリダイレクト
    if (isSignIn && path === '/login') {
      return <Redirect to="/" />;
    }
    if (requiresAuth) {
      // 認証していない場合ログインページへリダイレクト
      if (!isSignIn) {
        console.debug('認証失敗、ログイン画面へリダイレクト');
        return <Redirect to="/login" />;
      }
    }
    // 認証している場合はそのまま画面表示
    if (exact) {
      return <Route exact path={path} component={component} />;
    }
    return <Route path={path} component={component} />;
  }
  return <Route component={NotFoundPage} />;
};

export default BeforeRenderRoute;
