import React from 'react';
import { Route } from 'react-router-dom';

type Props = {
  exact: boolean;
  path?: string;
  component: any;
  requiresAuth: boolean;
};

const beforeRenderRoute: React.FC<Props> = ({
  exact,
  path,
  component,
  requiresAuth,
}) => {
  // 認証が必要ならページなら認証情報をチェック
  if (requiresAuth) {
    console.debug('認証情報チェック');
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

export default beforeRenderRoute;
