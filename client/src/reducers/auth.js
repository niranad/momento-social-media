import {
  AUTH,
  AUTH_COMPLETED,
  AUTH_FAILED,
  AUTH_PROCESSING,
  GOOGLE_AUTH,
  LOGOUT,
  SIGN_UP,
} from '../constants/actiontypes';
import decode from 'jwt-decode';

export default (
  state = {
    authData: null,
    authFailed: false,
    authProcessing: false,
    isSignUpAuth: false,
  },
  action,
) => {
  switch (action.type) {
    case AUTH_PROCESSING:
      return { ...state, authFailed: false, authProcessing: true };
    case AUTH_COMPLETED:
      return { ...state, authProcessing: false };
    case AUTH:
      localStorage.setItem('profile', JSON.stringify(action?.payload));
      return { ...state, authData: action?.payload, authProcessing: false };
      
    case GOOGLE_AUTH:
      const { given_name, family_name, email, sub } = decode(
        action.payload.token,
      );
      const authData = {
        result: {
          name: `${given_name} ${family_name}`,
          email,
          googleId: sub,
        },
        token: action.payload.token,
      };

      localStorage.setItem('profile', JSON.stringify(authData));

      return { ...state, authData, authProcessing: false };

    case SIGN_UP:
      return { ...state, isSignUpAuth: action.payload };
    case AUTH_FAILED:
      return { ...state, authFailed: true, authProcessing: false };
    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };
    default:
      return state;
  }
};
