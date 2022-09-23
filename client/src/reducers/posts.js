import {
  FETCH_ALL,
  FETCH_POST,
  FETCH_BY_SEARCH,
  UPDATE,
  COMMENT,
  CREATE,
  DELETE,
  START_LOADING,
  END_LOADING,
  UPDATE_FAILED,
  DELETE_FAILED,
  FETCH_POST_FAILED,
  FETCH_BY_SEARCH_FAILED,
  FETCH_ALL_FAILED,
  CREATE_FAILED,
} from '../constants/actiontypes';

export default (
  state = { isLoading: true, requestFailed: false, postsData: [] },
  action,
) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true, requestFailed: false };

    case END_LOADING:
      return { ...state, isLoading: false };

    case FETCH_ALL:
      return {
        ...state,
        postsData: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      };

    case FETCH_ALL_FAILED:
      return { ...state, requestFailed: true };

    case FETCH_BY_SEARCH:
      return {
        ...state,
        postsData: action.payload,
      };

    case FETCH_BY_SEARCH_FAILED:
      return { ...state, requestFailed: true };

    case FETCH_POST:
      return {
        ...state,
        post: action.payload,
      };

    case FETCH_POST_FAILED:
      return { ...state, requestFailed: true };

    case CREATE:
      return { ...state, postsData: [...state.postsData, action.payload] };

    case CREATE_FAILED:
      return { ...state, isLoading: false, requestFailed: true };

    case COMMENT:
      return {
        ...state,
        postsData: state.postsData.map((post) =>
          post._id !== action.payload._id ? post : action.payload,
        ),
      };

    case UPDATE:
      return {
        ...state,
        postsData: state.postsData.map((post) =>
          post._id === action.payload._id ? action.payload : post,
        ),
      };

    case UPDATE_FAILED:
      return { ...state, requestFailed: true };

    case DELETE:
      return {
        ...state,
        postsData: state.postsData.filter(
          (post) => post._id !== action.payload,
        ),
      };

    case DELETE_FAILED:
      return { ...state, requestFailed: true };

    default:
      return state;
  }
};
