import * as api from '../api/index';
import {
  FETCH_POST,
  FETCH_ALL,
  CREATE,
  UPDATE,
  COMMENT,
  DELETE,
  FETCH_BY_SEARCH,
  START_LOADING,
  END_LOADING,
  CREATE_FAILED,
  FETCH_BY_SEARCH_FAILED,
  FETCH_ALL_FAILED,
  FETCH_POST_FAILED,
  UPDATE_FAILED,
  COMMENT_FAILED,
  DELETE_FAILED,
} from '../constants/actiontypes';

// Action creators
export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.fetchPost(id);

    dispatch({ type: FETCH_POST, payload: data });

    dispatch({ type: END_LOADING });
  } catch (error) {
    dispatch({ type: FETCH_POST_FAILED });
    console.log(error);
  }
};

export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.fetchPosts(page);

    dispatch({ type: FETCH_ALL, payload: data });

    dispatch({ type: END_LOADING });
  } catch (error) {
    dispatch({ type: FETCH_ALL_FAILED });
    console.log(error.message);
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.fetchPostsBySearch(searchQuery);

    dispatch({ type: FETCH_BY_SEARCH, payload: data });

    dispatch({ type: END_LOADING });
  } catch (error) {
    dispatch({ type: FETCH_BY_SEARCH_FAILED });
    console.log(error);
  }
};

export const createPost = (post, history) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });

    history.push(`/posts/${data._id}`);

    dispatch({ type: END_LOADING });
  } catch (error) {
    dispatch({ type: CREATE_FAILED });
    console.log(error);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_FAILED });
    console.log(error);
  }
};

export const commentPost = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.comment(value, id);

    dispatch({ type: COMMENT, payload: data });

    return data.comments;
  } catch (error) {
    dispatch({ type: COMMENT_FAILED });
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_FAILED });
    console.log(error);
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_FAILED });
    console.log(error);
  }
};
