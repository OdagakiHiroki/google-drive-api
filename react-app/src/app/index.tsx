/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { Login } from './pages/Login/Loadable';
import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';

import BeforeRenderRoute from 'utils/BeforeRenderRoute';

export function App() {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>

      <Switch>
        <BeforeRenderRoute
          exact={true}
          path="/login"
          component={Login}
          requiresAuth={false}
        />
        <BeforeRenderRoute
          exact={true}
          path="/"
          component={HomePage}
          requiresAuth={true}
        />
        {/* TODO: Not Foundはページにする */}
        <BeforeRenderRoute
          exact={true}
          component={NotFoundPage}
          requiresAuth={false}
        />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
