import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PostDetails from './components/postDetails/PostDetails';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import NavBar from './components/NavBar/NavBar';
import EmailConfirmation from './components/Auth/EmailConfirmation';
import NotFound from './components/Auth/NotFound';

export default function App() {
  let user = null;

  const isSignUpAuth = () => {
    return localStorage.getItem('momento_sign_up_action') !== null;
  };

  const userExists = () => {
    user = JSON.parse(localStorage.getItem('momentoProfileObj'));
    return user !== null;
  };

  return (
    <GoogleOAuthProvider clientId='458553717636-8ihfjink5i2grviek0ujf8edc6qn3cn8.apps.googleusercontent.com'>
      <BrowserRouter>
        <Container maxWidth='xl'>
          <NavBar />
          <Switch>
            <Route
              path='/'
              exact
              component={() =>
                !userExists() ? <Auth /> : <Redirect to='/posts' />
              }
            />
            <Route
              path='/posts'
              exact
              component={() => (userExists() ? <Home /> : <Auth />)}
            />
            <Route
              path='/posts/search'
              exact
              component={() => (userExists() ? <Home /> : <Auth />)}
            />
            <Route
              path='/posts/:id'
              exact
              component={() => (userExists() ? <PostDetails /> : <Auth />)}
            />
            <Route
              path='/auth'
              exact
              component={() =>
                !userExists() ? <Auth /> : <Redirect to='/posts' />
              }
            />
            <Route
              path='/auth/signup/emailconfirmation'
              exact
              component={() =>
                isSignUpAuth() ? <EmailConfirmation /> : <NotFound />
              }
            />
          </Switch>
        </Container>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

