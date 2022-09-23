import * as api from '../api/index';
import {
  AUTH,
  AUTH_COMPLETED,
  AUTH_FAILED,
  AUTH_PROCESSING,
  SIGN_UP,
} from '../constants/actiontypes';

export const signIn = (formData, history) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_PROCESSING });

    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, payload: data });

    history.push('/');

    dispatch({ type: AUTH_COMPLETED });
  } catch (error) {
    dispatch({ type: AUTH_FAILED });
    console.log(error);
  }
};

export const signUp = (formData, history) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_PROCESSING });

    await api.signUp(formData);

    dispatch({ type: SIGN_UP, payload: true });

    dispatch({ type: AUTH_COMPLETED });

    localStorage.setItem('momento_sign_up_action', '***momento_sign***up***');

    history.push('/auth/signup/emailconfirmation');
  } catch (error) {
    dispatch({ type: AUTH_FAILED });
    console.log(error);
  }
};
