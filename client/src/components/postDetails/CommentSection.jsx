import React, { useState, useRef } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import AddCommentRoundedIcon from '@material-ui/icons/AddCommentRounded';
import CommentIcon from '@material-ui/icons/Comment';
import CreateIcon from '@material-ui/icons/Create';
import { useDispatch } from 'react-redux';
import useStyles from './styles';
import { commentPost } from '../../actions/posts';
import CommentInfo from './CommentInfo';

export default function CommentSection({ post }) {
  const classes = useStyles();
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('momentoProfileObj'));
  const commentsRef = useRef();

  const handleClick = async () => {
    const finalComment = `${user.result.name}: ${comment}`;

    setComment('');

    const updatedComments = await dispatch(commentPost(finalComment, post._id));

    setComments(updatedComments);

    commentsRef.current.scrollIntoView({ behaviour: 'smooth' });
  };

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
            <Button
              styles={{ marginTop: '10px' }}
              fullWidth
              disabled={!comment}
              variant='contained'
              color='primary'
              onClick={handleClick}
            >
              <AddCommentRoundedIcon sx={{ color: '#f8f7fc' }} /> Add Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
