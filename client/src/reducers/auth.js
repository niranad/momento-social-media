import {
  AUTH,
  AUTH_COMPLETED,
  AUTH_FAILED,
  AUTH_PROCESSING,
  LOGOUT,
} from '../constants/actiontypes';

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
      localStorage.setItem('momentoProfileObj', JSON.stringify(action?.payload));
      return { ...state, authData: action?.payload, authProcessing: false };
    case AUTH_FAILED:
      return { ...state, authFailed: true, authProcessing: false };
    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };
    default:
      return state;
  }
};
