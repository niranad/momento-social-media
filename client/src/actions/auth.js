import * as api from '../api/index';
import {
  AUTH,
  AUTH_COMPLETED,
  AUTH_FAILED,
  AUTH_PROCESSING,
} from '../constants/actiontypes';

export const signIn = (formData, history) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_PROCESSING });

    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, payload: data });

    dispatch({ type: AUTH_COMPLETED });

    history.push('/');
  } catch (error) {
    dispatch({ type: AUTH_FAILED });
    console.log(error);
  }
};

export const signUp = (formData, history) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_PROCESSING });

    await api.signUp(formData);

    dispatch({ type: AUTH_COMPLETED });

    localStorage.setItem('momento_sign_up_action', '***momento_sign***up***');

    history.push('/auth/signup/emailconfirmation');
  } catch (error) {
    dispatch({ type: AUTH_FAILED });
    console.log(error);
  }
};

export const signInWithGoogle =
  (googleResponse, history) => async (dispatch) => {
    try {
      dispatch({ type: AUTH_PROCESSING });

      const { data } = await api.signInWithGoogle(googleResponse);

      dispatch({ type: AUTH, payload: data });

      dispatch({ type: AUTH_COMPLETED });

      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };
