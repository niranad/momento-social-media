import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  Button,
  Paper,
  Icon,
  CircularProgress,
  Collapse,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useDispatch } from 'react-redux';
import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SET_TRANSIENT_STATE } from '../../constants/actiontypes';
import { PhotoCamera } from '@material-ui/icons';

export default function Form({ currentId, setCurrentId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const post = useSelector(({ posts }) =>
    currentId ? posts.postsData.find((post) => post._id === currentId) : null,
  );
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem('momentoProfileObj'));
  const {
    isCreatingPost,
    isUpdatingPost,
    createdPost,
    createPostFailed,
    updatedPost,
    updatePostFailed,
  } = useSelector(({ posts }) => posts);
  const [openAlert, setOpenAlert] = useState(true);

  const [postData, setPostData] = useState({
    title: '',
    message: '',
    tags: '',
    selectedFile: '',
  });

  useEffect(() => {
    if (post)
      setPostData({
        ...post,
        selectedFile:
          typeof post?.selectedFile === 'object' ? '' : post?.selectedFile,
        tags: post?.tags.join(','),
      });

    if (createdPost || createPostFailed || updatedPost || updatePostFailed) {
      if (!openAlert) setOpenAlert(true);

      const timeout = setTimeout(() => {
        setOpenAlert(false);

        dispatch({ type: SET_TRANSIENT_STATE });
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [post, createdPost, createPostFailed, updatedPost, updatePostFailed]);

  const onFileInput = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        setPostData({ ...postData, selectedFile: reader.result });
      },
      false,
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const enableSubmit = () =>
    postData.title !== '' && postData.message !== '' && !isCreatingPost;

  const clear = () => {
    setCurrentId(null);
    setPostData({
      title: '',
      message: '',
      tags: '',
      selectedFile: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId) {
      dispatch(
        updatePost(currentId, {
          ...postData,
          tags: postData.tags
            .replace(/[?}{\]\[#_/$&@)><(|!%*^+\.\\-]/g, '')
            .split(/[^a-z0-9]+/i)
            .filter((val) => val !== ''),
          name: user?.result?.name,
        }),
      );
    } else {
      dispatch(
        createPost(
          {
            ...postData,
            tags: postData.tags
              .replace(/[?}{\]\[#_/$&@)><(|!%*^+\.\\-]/g, '')
              .split(/[^a-z0-9]+/i)
              .filter((val) => val !== ''),
            name: user?.result?.name,
          },
          history,
        ),
      );
    }

    clear();
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        className={`${classes.form} ${classes.root}`}
        autoComplete='off'
        noValidate
        onSubmit={handleSubmit}
      >
        <Typography variant='h6'>
          {currentId ? 'Edit' : 'Create'} a Moment{' '}
          {currentId ? <Icon>edit</Icon> : <Icon>panorama</Icon>}
        </Typography>

        <TextField
          name='title'
          variant='outlined'
          label='Title'
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField
          name='message'
          variant='outlined'
          label='Message'
          fullWidth
          multiline
          rows={4}
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <TextField
          name='tags'
          variant='outlined'
          label='Tags'
          fullWidth
          value={postData.tags}
          onChange={(e) => {
            setPostData({ ...postData, tags: e.target.value });
          }}
        />

        <Button
          variant='outlined'
          className={classes.fileInput}
          component='label'
          endIcon={<PhotoCamera color='primary' size='medium' />}
        >
          <input hidden type='file' accept='image/*' onChange={onFileInput} />
          {postData?.selectedFile ? 'Replace Image' : 'Upload Image'}
        </Button>
        {postData?.selectedFile ? (
          <div id='img-preview-div' className={classes.imgPreview}>
            <img
              className={classes.picture}
              src={postData.selectedFile}
              alt='Moment Picture'
            />
          </div>
        ) : (
          ''
        )}
        {createdPost || updatedPost || createPostFailed || updatePostFailed ? (
          <Collapse in={openAlert}>
            <Alert
              style={{ marginTop: 7, fontSize: 16 }}
              severity={createdPost || updatedPost ? 'success' : 'error'}
            >
              {createdPost
                ? 'Moment Created'
                : updatedPost
                ? 'Moment Updated'
                : createPostFailed
                ? 'Moment creation failed. Try again.'
                : 'Moment update failed. Try again.'}
            </Alert>
          </Collapse>
        ) : (
          ''
        )}
        <Button
          className={classes.buttonSubmit}
          variant='contained'
          color='primary'
          size='large'
          type='submit'
          disabled={!enableSubmit()}
          fullWidth
        >
          Submit&nbsp;
          {isCreatingPost || isUpdatingPost ? (
            <CircularProgress size='18px' />
          ) : (
            <Icon sx={{ color: '#f8f7fc' }}>rocket_launch</Icon>
          )}
        </Button>
        <Button
          className={classes.clear}
          variant='contained'
          color='secondary'
          size='large'
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
}
