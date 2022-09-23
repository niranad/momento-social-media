import React, { useState, useEffect, useMemo } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import UserIcon from '@material-ui/icons/PersonOutlineSharp';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { LOGOUT } from '../../constants/actiontypes';
import decode from 'jwt-decode';
import useStyles from './styles.js';

export default function NavBar() {
  const classes = useStyles();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [decodedToken, setDecodedToken]= useState({});
  const isGoogleAuthUser = user?.result?.googleId;

  const logout = () => {
    dispatch({ type: LOGOUT });
    history.push('/');
    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      setDecodedToken(decode(token));
      if (decodedToken?.exp * 1000 < new Date().getTime()) {
        logout();
      }
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [decodedToken.exp, location]);

  if (!user) return null;

  return (
    <AppBar className={classes.appBar} position='static' color='inherit'>
      <div className={classes.brandContainer}>
        <Typography
          component={Link}
          to='/'
          className={classes.heading}
          variant='h2'
          align='center'
        >
          Momento
        </Typography>
      </div>
      <Toolbar className={classes.toolbar}>
        {user ? (
          <div className={classes.profile}>
            <Avatar
              className={classes.purple}
              src={user.result?.imageUrl}
              alt={user.result.name}
            >
              {/* If signed with google */}
              {isGoogleAuthUser ? (
                decodedToken?.picture
              ) : (
                <UserIcon sx={{ color: '#f8f7fc' }} />
              )}
            </Avatar>
            <Typography className={classes.userName} variant='h6'>
              {isGoogleAuthUser
                ? `${decodedToken?.given_name} ${decodedToken?.family_name}`
                : user?.result.name}
            </Typography>
            <Button
              variant='contained'
              className={classes.logout}
              color='secondary'
              onClick={logout}
            >
              Sign out&nbsp;<Icon sx={{ color: '#f8f7fc' }}>logout</Icon>
            </Button>
          </div>
        ) : (
          ''
        )}
      </Toolbar>
    </AppBar>
  );
}
