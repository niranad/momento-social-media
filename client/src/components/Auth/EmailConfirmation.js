import React from 'react';
import { Box, Typography } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import useStyles from './styles';

const EmailConfirmation = () => {
  const classes = useStyles();
  
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
