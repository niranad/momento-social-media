import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
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
  const user = JSON.parse(localStorage.getItem('momentoProfileObj'));
  const [isLengthy, setIsLengthy] = useState(false);
  const history = useHistory();
  const [likes, setLikes] = useState(post?.likes);
  const userId = user?.result?._id;
  const hasLikedPost = likes?.some((id) => id === userId);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = () => {
    dispatch(deletePost(post._id));
    handleCloseDialog();
  };

  const confirmDelete = () => {
    setOpenDialog(true);
  };

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

  // Sub component for like functionality
  const Like = () => {
    if (likes.length > 0) {
      return likes.find((id) => id === userId) ? (
        <>
          <ThumbUpAltIcon fontSize='small' />
          &nbsp;You
          {likes.length >= 2
            ? ` and ${likes.length - 1} other${likes.length - 1 > 1 ? 's' : ''}`
            : ''}{' '}
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
  const formatTags = () => {
    if (!post?.tags.length) {
      return '';
    }
    let tags;
    if (post?.tags.length > 6) {
      tags = post?.tags.filter((tag, i) => i < 6);
      return `#${tags.join(', #')}...`;
    }
    return `#${post?.tags.join(', #')}`;
  };

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
          <Typography variant='h6'>
            {post.creator === userId ? 'You' : post.name}
          </Typography>
          <Typography variant='body2'>
            {Moment(post.createdAt).fromNow()}
          </Typography>
        </div>
        <div className={classes.overlay2}>
          {userId === post.creator && (
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
          )}
        </div>
        <div className={classes.details}>
          <Typography variant='body2' color='textSecondary'>
            {formatTags()}
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
        {userId === post.creator && (
          <Button
            className={classes.cardActionsButton}
            size='small'
            color='secondary'
            onClick={confirmDelete}
          >
            <DeleteIcon fontSize='small' />
            Delete
          </Button>
        )}
      </CardActions>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {`Delete '${post.title}' moment?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this moment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            No
          </Button>
          <Button onClick={handleDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
