import React, { useState, useEffect, useMemo } from 'react';
import FileBase from 'react-file-base64';
import { TextField, Typography, Button, Paper } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';
import { useSelector } from 'react-redux';

const Form = ({ currentId, setCurrentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const post = useSelector(({ posts }) =>
    currentId ? posts.find((post) => post._id === currentId) : {},
  );
  const { creator, title, message, tags, selectedFile } = post;

  const postMemo = useMemo(
    () => ({
      creator,
      title,
      message,
      tags,
      selectedFile,
    }),
    [creator, title, message, tags, selectedFile],
  );

  const [postData, setPostData] = useState({
    creator: '',
    title: '',
    message: '',
    tags: '',
    selectedFile: '',
  });

  useEffect(() => {
    if (postMemo) setPostData(postMemo);
  }, [postMemo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId) {
      dispatch(updatePost(currentId, postData));
    } else {
      dispatch(createPost(postData));
    }

    clear();
  };

  const clear = () => {
    setCurrentId(null);
    setPostData({
      creator: '',
      title: '',
      message: '',
      tags: '',
      selectedFile: '',
    });
  };

  return (
    <Paper className={classes.paper}>
      <form
        className={`${classes.form} ${classes.root}`}
        autoComplete='off'
        noValidate
        onSubmit={handleSubmit}
      >
        <Typography variant='h6'>
          {currentId ? 'Edit' : 'Create'} a Memory
        </Typography>

        <TextField
          name='creator'
          variant='outlined'
          label='Creator'
          fullWidth
          value={postData.creator}
          onChange={(e) =>
            setPostData({ ...postData, creator: e.target.value })
          }
        />
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
          onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(/[,]\s+?/) })}
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
          Submit
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
};

export default Form;
