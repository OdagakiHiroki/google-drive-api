import React from 'react';
import { Route } from 'react-router-dom';
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
  console.debug(window.gapi);
  // googleApiのロードがされていなかった場合、ロードする
  if (window.gapi) {
    // 認証が必要ならページなら認証情報をチェック
    console.debug('認証情報チェック');
    if (requiresAuth) {
      // 認証していない場合ログインページへリダイレクト
      if (false) {
        console.debug('認証失敗、ログイン画面へリダイレクト');
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
