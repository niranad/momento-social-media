import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem('profile')).token
    }`;
  }

  return req;
});

// post requests
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get( `/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery) =>
  API.get(
    `/posts/search?title=${searchQuery.title || 'none'}&tags=${
      searchQuery.tags
    }`,
  );
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) =>
  axios.patch(`/posts/${id}/editPost`, updatedPost);
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value })
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

// user requests
export const signIn = (formData) => API.post('/users/signin', formData);
export const signUp = (formData) => API.post('/users/signup', formData);
