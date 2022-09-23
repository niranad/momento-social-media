import React, { useEffect } from 'react';
import { Box, Typography } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import  { useDispatch } from 'react-redux';
import useStyles from './styles';
import { SIGN_UP } from '../../constants/actiontypes';

const EmailConfirmation = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    const listener = () => {
      dispatch({ type: SIGN_UP, payload: false });
    };
    window.addEventListener('popstate', listener)
  
    return () => {
      window.removeEventListener('popstate', listener);
    }
  }, []);
  
  return (
    <Box className={classes.emailBox}>
      <EmailIcon fontSize='large' sx={{ color: '#fff', backgroundColor: '#fff'}} />
      <Typography style={{ textAlign: 'center' }} variant='h5' color='textSecondary' component='h5'>
        We just sent you a confirmation email. Please check your inbox and follow the instructions.
      </Typography>
    </Box>
  );
};

export default EmailConfirmation;
