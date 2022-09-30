import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { LOGOUT } from '../../constants/actiontypes';
import decode from 'jwt-decode';
import useStyles from './styles.js';

export default function NavBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('momentoProfileObj')),
  );
  const location = useLocation();

  const logout = () => {
    dispatch({ type: LOGOUT });
    history.push('/');
    setUser(null);
  };

  useEffect(() => {
    if (location.pathname !== '/posts/search') {
      const token = user?.token;

      if (token) {
        const decodedToken = decode(token);

        if (decodedToken?.exp * 1000 < new Date().getTime()) {
          logout();
        }
      }

      setUser(JSON.parse(localStorage.getItem('momentoProfileObj')));
    }
  }, [location]);

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
              src={user?.imageUrl}
              alt={user?.result?.name}
            >
              {user?.result?.name?.charAt(0)}
            </Avatar>
            <Typography className={classes.userName} variant='h6'>
              {user?.result?.name.length > 12
                ? `${user?.result?.name.split(' ')[0]} ${user?.result?.name
                    .split(' ')[1]
                    .charAt(0)
                    .toUpperCase()}.`
                : user?.result?.name}
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
