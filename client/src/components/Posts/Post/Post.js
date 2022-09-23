import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
  ButtonBase,
} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Moment from 'moment';
import useStyles from './styles';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { deletePost, likePost } from '../../../actions/posts';
import placeholder from '../../../images/placeholder.jpg';

export default function Post({ post, setCurrentId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const [isLengthy, setIsLengthy] = useState(false);
  const history = useHistory();
  const [likes, setLikes] = useState(post?.likes);
  const userId = user?.result?.googleId || user?.result?._id;
  const hasLikedPost = likes?.some((id) => id === userId);

  const openPost = () => {
    history.push(`/posts/${post._id}`);
  };

  const handleLike = () => {
    if (hasLikedPost) {
      setLikes(likes.filter((id) => id !== userId));
    } else {
      setLikes([...likes, userId]);
    }

    dispatch(likePost(post._id));
  };

  const Like = () => {
    if (likes.length > 0) {
      return likes.find((id) => id === userId) ? (
        <>
          <ThumbUpAltIcon fontSize='small' />
          &nbsp;You
          {likes.length >= 2
            ? ` and ${likes.length - 1} other${likes.length - 1 > 1 ? 's' : ''}`
            : ''}{' '}
          liked this
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize='small' />
          &nbsp;{likes.length} {likes.length > 1 ? 'likes' : 'like'}{' '}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize='small' />
        &nbsp;Like
      </>
    );
  };

  const message = !post?.message ? '' : post?.message;

  useEffect(() => {
    setIsLengthy(message.length > 120);
  }, [message]);

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase className={classes.cardAction} onClick={openPost}>
        <CardMedia
          className={classes.media}
          image={post.selectedFile || placeholder}
          title={post.title}
        />
        <div className={classes.overlay}>
          <Typography variant='h6'>{post.name}</Typography>
          <Typography variant='body2'>
            {Moment(post.createdAt).fromNow()}
          </Typography>
        </div>
        <div className={classes.overlay2}>
          {user?.result?._id === post.googleId ||
            (user?.result?._id === post.creator && (
              <Button
                style={{ color: 'white' }}
                size='small'
                title='Edit Post'
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentId(post._id);
                }}
              >
                <MoreHorizIcon fontSize='medium' />
              </Button>
            ))}
        </div>
        <div className={classes.details}>
          <Typography variant='body2' color='textSecondary'>
            {post?.tags &&
              post.tags.map(
                (tag, i, arr) => `#${tag}${i < arr.length - 1 ? ', ' : ''}`,
              )}
          </Typography>
        </div>
        <Typography className={classes.title} variant='h6' gutterBottom>
          {post.title}
        </Typography>
        <CardContent>
          <Typography variant='body1' color='textPrimary' component='p'>
            <div>{isLengthy ? message.substring(0, 120) + '...' : message}</div>
          </Typography>
        </CardContent>
      </ButtonBase>

      <CardActions className={classes.cardActions}>
        <Button
          className={classes.cardActionsButton}
          size='small'
          color='primary'
          disabled={!user?.result}
          onClick={handleLike}
        >
          <Like post={post} user={user} />
        </Button>
        {user &&
          (user?.result?.googleId === post.creator ||
            user?.result._id === post.creator) && (
            <Button
              className={classes.cardActionsButton}
              size='small'
              color='primary'
              onClick={() => dispatch(deletePost(post._id))}
            >
              <DeleteIcon fontSize='small' />
              Delete
            </Button>
          )}
      </CardActions>
    </Card>
  );
}
