import React, { useState, useEffect } from 'react';
import FileBase from 'react-file-base64';
import { TextField, Typography, Button, Paper, Icon } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function Form({ currentId, setCurrentId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const post = useSelector(({ posts }) =>
    currentId ? posts.postsData.find((post) => post._id === currentId) : null,
  );
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem('momentoProfileObj'));

  const [postData, setPostData] = useState({
    title: '',
    message: '',
    tags: '',
    selectedFile: '',
  });

  useEffect(() => {
    if (post) setPostData({ ...post, tags: post.tags.join(',') });
  }, [post]);

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

  const clear = () => {
    setCurrentId(null);
    setPostData({
      title: '',
      message: '',
      tags: '',
      selectedFile: '',
    });
  };

  if (!user?.result?.name) {
    return (
      <Paper elevation={6}>
        <Typography className={classes.paper} variant='h6'>
          Please Sign In to create your own Moments and like other peoples'
          Moments.
        </Typography>
      </Paper>
    );
  }

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

        <div className={classes.fileInput}>
          <FileBase
            type='file'
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>

        <Button
          className={classes.buttonSubmit}
          variant='contained'
          color='primary'
          size='large'
          type='submit'
          fullWidth
        >
          Submit&nbsp;<Icon sx={{ color: '#f8f7fc' }}>rocket_launch</Icon>
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
