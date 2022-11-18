import React, { useState, useRef, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Collapse,
  CircularProgress,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AddCommentRoundedIcon from '@material-ui/icons/AddCommentRounded';
import CommentIcon from '@material-ui/icons/Comment';
import CreateIcon from '@material-ui/icons/Create';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
import { commentPost } from '../../actions/posts';
import CommentInfo from './CommentInfo';
import { SET_TRANSIENT_STATE } from '../../constants/actiontypes';

export default function CommentSection({ post }) {
  const classes = useStyles();
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('momentoProfileObj'));
  const commentsRef = useRef();
  const { isCommentingPost, commentedPost, commentPostFailed } = useSelector(
    ({ posts }) => posts,
  );
  const [openAlert, setOpenAlert] = useState(true);

  const handleClick = async () => {
    const finalComment = `${user.result.name}: ${comment}`;

    setComment('');

    const updatedComments = await dispatch(commentPost(finalComment, post._id));

    setComments(updatedComments);

    commentsRef.current.scrollIntoView({ behaviour: 'smooth' });
  };

  useEffect(() => {
    if (commentedPost || commentPostFailed) {
      if (!openAlert) setOpenAlert(true);

      const timeout = setTimeout(() => {
        setOpenAlert(false);

        dispatch({ type: SET_TRANSIENT_STATE });
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [commentedPost, commentPostFailed]);

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography
            style={{ fontFamily: 'Sora, Verdana' }}
            gutterBottom
            variant='h6'
          >
            <strong>Comments</strong> <CommentIcon />
          </Typography>
          {!comments.length ? (
            <Typography variant='body2' color='textSecondary' component='p'>
              No comments for this post
            </Typography>
          ) : (
            comments.map((comment, i) => (
              <CommentInfo comment={comment} index={i} />
            ))
          )}
          <div ref={commentsRef} />
        </div>
        {user?.result?.name && (
          <div style={{ minWidth: '60%', marginTop: '10px' }}>
            <Typography
              style={{ fontFamily: 'Sora, Verdana' }}
              gutterBottom
              variant='h6'
            >
              <strong>Write a Comment</strong> <CreateIcon />
            </Typography>
            <TextField
              fullWidth
              rows={4}
              variant='outlined'
              label='Comment'
              multiline
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            {commentedPost || commentPostFailed ? (
              <Collapse in={openAlert}>
                <Alert
                  style={{ marginTop: 7, fontSize: 16 }}
                  severity={commentedPost ? 'success' : 'error'}
                >
                  {commentedPost
                    ? 'Comment added'
                    : 'Failed to comment post. Try again.'}
                </Alert>
              </Collapse>
            ) : (
              ''
            )}
            <Button
              styles={{ marginTop: '14px' }}
              fullWidth
              disabled={!comment}
              variant='contained'
              color='primary'
              onClick={handleClick}
            >
              Add Comment&nbsp;
              {isCommentingPost ? (
                <CircularProgress size='18px' />
              ) : (
                <AddCommentRoundedIcon sx={{ color: '#f8f7fc' }} />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
