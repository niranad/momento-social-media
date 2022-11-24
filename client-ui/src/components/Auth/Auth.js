import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  Backdrop,
  CircularProgress,
  IconButton,
  Collapse,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import Icon from '@material-ui/core/Icon';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import { signIn, signUp, signInWithGoogle } from '../../actions/auth';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Auth() {
  const classes = useStyles();
  const { authProcessing, authFailed } = useSelector(
    ({ authProfile }) => authProfile,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();
  const [openAlert, setOpenAlert] = useState(true);
  
  /**
   * Run only once when component mounts
   */
  useEffect(() => {
    localStorage.removeItem('momento_sign_up_action');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!openAlert) setOpenAlert(true);

    if (isSignUp) {
      dispatch(signUp(formData, history));
    } else {
      dispatch(signIn(formData, history));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setShowPassword(false);
  };

  const googleSuccess = (res) => {
    try {
      dispatch(signInWithGoogle(res, history));
    } catch (error) {
      console.log(error);
    }
  };

  const googleFailure = (error) => {
    console.log('Google Sign in was unsuccessful. Try again later');
  };

  return (
    <Container className={classes.container} component='main' maxWidth='lg'>
      <Backdrop className={classes.backdrop} open={authProcessing}>
        <div>
          <Typography
            style={{ padding: 0, color: '#fff' }}
            variant='body2'
            component='h5'
            gutterBottom
          >
            Processing...
          </Typography>
          <CircularProgress color='inherit' />
        </div>
      </Backdrop>
      <div className={classes.intro}>
        <Typography
          className={classes.logotext}
          variant='h3'
          component='h3'
        >
          Momento
        </Typography>
        <Typography
          className={classes.brandpitch}
          gutterBottom
          variant='h6'
          component='h6'
        >
          Helps you connect with people and share notable moments in your life.
        </Typography>
      </div>
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h5'>Sign {isSignUp ? ' Up' : ' In'}</Typography>
        {authFailed ? (
          <Collapse in={openAlert}>
            <Alert
              style={{ marginTop: 7, fontSize: 16 }}
              severity='error'
              action={
                <IconButton
                  aria-label='close'
                  size='small'
                  color='inherit'
                  onClick={() => {
                    setOpenAlert(false);
                  }}
                >
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
            >
              {isSignUp
                ? "EITHER YOUR PASSWORDS DON'T MATCH"
                : 'EITHER YOU ENTERED INVALID CREDENTIALS'}{' '}
              OR SOMETHING WENT WRONG
            </Alert>
          </Collapse>
        ) : (
          ''
        )}
        <form className={classes.form} onSubmit={handleSubmit} data-testid='auth-form'>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Input
                  id='firstName'
                  name='firstName'
                  label='First Name'
                  handleChange={handleChange}
                  autoFocus={true}
                  half={true}
                />
                <Input
                  id='lastName'
                  name='lastName'
                  label='Last Name'
                  handleChange={handleChange}
                  half={true}
                />
              </>
            )}

            <Input
              id='email'
              name='email'
              label='Email'
              autoFocus={true}
              handleChange={handleChange}
              type='email'
            />
            <Input
              id='password'
              testid='mui-password-field'
              name='password'
              label='Password'
              handleChange={handleChange}
              handleShowPassword={handleShowPassword}
              type={showPassword ? 'text' : 'password'}
            />
            {isSignUp && (
              <Input
                id='confirmPassword'
                testid='mui-confirmpassword-field'
                name='confirmPassword'
                label='Confirm Password'
                handleChange={handleChange}
                type={showPassword ? 'text' : 'password'}
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
            &nbsp; Sign {isSignUp ? ' Up' : ' In'}&nbsp;{' '}
            {!isSignUp ? (
              <Icon sx={{ color: 'f8f7fc' }}>login</Icon>
            ) : (
              <Icon sx={{ color: 'f8f7fc' }}>straight</Icon>
            )}{' '}
          </Button>

          <GoogleLogin
            onSuccess={googleSuccess}
            onError={googleFailure}
            shape='pill'
            text={isSignUp ? 'signup_with' : 'signin_with'}
            size='large'
            logo_alignment='left'
            theme='filled_black'
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
}
