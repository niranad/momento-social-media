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
  FETCH_BY_SEARCH_PENDING,
  COMMENT_PENDING,
  COMMENT_FAILED,
  UPDATE_PENDING,
  DELETE_PENDING,
  NO_POST_FROM_SEARCH,
  CREATE_PENDING,
  SET_TRANSIENT_STATE,
} from '../constants/actiontypes';

export default (
  state = {
    isLoading: true,
    postsData: [],
    isCreatingPost: false,
    createPostFailed: false,
    createdPost: false,
    isUpdatingPost: false,
    updatePostFailed: false,
    updatedPost: false,
    isDeletingPost: false,
    deletePostFailed: false,
    isFetchingPosts: false,
    fetchPostsFailed: false,
    isFetchingPost: false,
    fetchPostFailed: false,
    isFetchingBySearch: false,
    fetchBySearchFailed: false,
    searchIsEmpty: false,
    isCommentingPost: false,
    commentPostFailed: false,
    commentedPost: false,
  },
  action,
) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        isLoading: true,
        fetchPostFailed: false,
        fetchPostsFailed: false,
      };

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
      return { ...state, fetchPostsFailed: true, isLoading: false };

    case FETCH_BY_SEARCH:
      return {
        ...state,
        postsData: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
        isFetchingBySearch: false,
        isLoading: false,
      };

    case FETCH_BY_SEARCH_PENDING:
      return {
        ...state,
        isFetchingBySearch: true,
      };

    case FETCH_BY_SEARCH_FAILED:
      return {
        ...state,
        fetchBySearchFailed: true,
        isFetchingBySearch: false,
        isLoading: false,
      };

    case NO_POST_FROM_SEARCH:
      return {
        ...state,
        searchIsEmpty: true,
        isFetchingBySearch: false,
        isLoading: false,
      };

    case FETCH_POST:
      return {
        ...state,
        post: action.payload,
      };

    case FETCH_POST_FAILED:
      return { ...state, fetchPostFailed: true, isLoading: false };

    case CREATE:
      return {
        ...state,
        postsData: [...state.postsData, action.payload],
        isCreatingPost: false,
        createdPost: true,
      };

    case CREATE_PENDING:
      return {
        ...state,
        isCreatingPost: true,
      };

    case CREATE_FAILED:
      return {
        ...state,
        createPostFailed: true,
        isCreatingPost: false,
      };

    case COMMENT:
      return {
        ...state,
        postsData: state.postsData.map((post) =>
          post._id !== action.payload._id ? post : action.payload,
        ),
        isCommentingPost: false,
        commentedPost: true,
      };

    case COMMENT_PENDING:
      return {
        ...state,
        isCommentingPost: true,
      };

    case COMMENT_FAILED:
      return { ...state, isCommentingPost: false, commentPostFailed: true };

    case UPDATE:
      return {
        ...state,
        postsData: state.postsData.map((post) =>
          post._id === action.payload._id ? action.payload : post,
        ),
        isUpdatingPost: false,
        updatedPost: true,
      };

    case UPDATE_PENDING:
      return {
        ...state,
        isUpdatingPost: true,
      };

    case UPDATE_FAILED:
      return { ...state, updatePostFailed: true, isUpdatingPost: false };

    case DELETE:
      return {
        ...state,
        postsData: state.postsData.filter(
          (post) => post._id !== action.payload,
        ),
        isDeletingPost: false,
      };

    case DELETE_PENDING:
      return { ...state, isDeletingPost: true, deletePostFailed: false };

    case DELETE_FAILED:
      return { ...state, deletePostFailed: true, isDeletingPost: false };

    case SET_TRANSIENT_STATE:
      return {
        ...state,
        createdPost: false,
        createPostFailed: false,
        updatedPost: false,
        updatePostFailed: false,
        commentedPost: false,
        commentPostFailed: false,
        fetchBySearchFailed: false,
        searchIsEmpty: false,
      };

    default:
      return state;
  }
};
