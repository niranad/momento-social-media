import React from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import memories from '../../images/memories.png';
import useStyles from './styles.js';

const NavBar = () => {
  const classes = useStyles();
  const user = null;

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
          Memories&nbsp;
        </Typography>
        <img src={memories} alt='memories' height='60' />
      </div>
      <Toolbar className={classes.toolbar}>
{
  user ? (
    <div className={classes.profile}>
      <Avatar className={classes.purple} src={user.result.imageUrl} alt={user.result.name}>{user.result.name.charAt(0).toUpperCase()}</Avatar>
      <Typography className={classes.userName} variant='h6'>{user.result.userName}</Typography>
      <Button variant='contained' className={classes.logout} color='secondary' onClick={() => {}}>Sign out</Button>
    </div>
  ) : (
    <Button className={classes.login} component={Link} to='/auth' variant='contained' color='primary'>Sign in</Button>
  )
}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
