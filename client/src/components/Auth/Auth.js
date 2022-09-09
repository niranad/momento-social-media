import React, { useState } from 'react';
import dotenv from 'dotenv';
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Icon from './Icon';
import useStyles from './styles';
import Input from './Input';

dotenv.config();

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = () => {};

  const handleChange = () => {};

  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setShowPassword(false);
  };

  const googleSuccess = (res) => {
    console.log(res)
  }

  const googleFailure = () => {
    console.log('Google Sign in was unsuccessful. Try again later');
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h5'>Sign {isSignUp ? ' Up' : ' In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Input
                  name='firstName'
                  label='First Name'
                  handleChange={handleChange}
                  autoFocus
                  half={true}
                />
                <Input
                  name='lastName'
                  label='Last Name'
                  handleChange={handleChange}
                  half={true}
                />
              </>
            )}

            <Input
              name='email'
              label='Email'
              onChange={handleChange}
              type='email'
            />
            <Input
              name='password'
              label='Password'
              onChange={handleChange}
              handleShowPassword={handleShowPassword}
              type={showPassword ? 'text' : 'password'}
            />
            {isSignUp && (
              <Input
                name='confirmPassword'
                label='Confirm Password'
                handleChange={handleChange}
              />
            )}
          </Grid>
          <Button
            className={classes.submit}
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
          >
            Sign {isSignUp ? ' Up' : ' In'}
          </Button>

          <GoogleLogin
            clientId={process.env.GOOGLE_CLIENT_ID}
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color='primary'
                variant='contained'
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                onSuccess={googleSuccess}
                onFailure={googleFailure}
                cookiePolicy='single_host_origin'
              >
                Google Sign In
              </Button>
            )}
          />
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Button onClick={switchMode}>
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
