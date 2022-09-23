import React, { useEffect } from 'react';
import {
  Paper,
  CircularProgress,
  Divider,
  Typography,
} from '@material-ui/core';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection';
import placeholder from '../../images/placeholder.jpg';
import useStyles from './styles';
import PostDetailsSkeleton from './PostDetailsSkeleton';

export default function PostDetails () {
  const { post, postsData, isLoading } = useSelector(({ posts }) => posts);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ title: 'postdetails@post', tags: post?.tags.join(',') }));
    }
  }, [post]);

  const recommendedPosts = postsData?.filter(({ _id }) => _id !== post?._id);

  const openPost = (id) => history.push(`/posts/${id}`);

  if (!post)
    return (
      <Paper className={classes.loadingPaper} raised elevation={6}>
        <CircularProgress size='4rem' />
      </Paper>
    );

  return isLoading ? (
    <PostDetailsSkeleton />
  ) : (
      <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
        <div className={classes.card}>
          <div className={classes.section}>
            <Typography variant='h3' component='h2'>
              {post?.title}
            </Typography>
            <Typography
              gutterBottom
              variant='h6'
              color='textSecondary'
              component='h2'
            >
              {post ? '#' + post.tags.join(', #') : ''}
            </Typography>
            <Typography
              className={classes.message}
              gutterBottom
              variant='body1'
              component='p'
            >
              {post?.message}
            </Typography>
            <Typography
              style={{ fontWeight: 550, display: 'inline' }}
              variant='h6'
              color='textPrimary'
            >
              {post.name}
            </Typography>
            <Typography
              style={{ textAlign: 'right', display: 'inline', float: 'right' }}
              variant='body1'
              color='textSecondary'
            >
              {Moment(post.createdAt).fromNow()}
            </Typography>
            <Divider style={{ margin: '20px 0' }} />
            <CommentSection post={post} />
          </div>

          <div className={classes.imageSection}>
            <img
              className={classes.media}
              src={post.selectedFile || placeholder}
            />
          </div>
        </div>

        {recommendedPosts.length ? (
          <div className={classes.section}>
            <Typography gutterBottom variant='h5'>
              <ThumbUpRoundedIcon /> <strong>You might also like:</strong>
            </Typography>
            <Divider />
            <div className={classes.recommendedPosts}>
              {recommendedPosts.map(
                ({ title, message, name, _id, selectedFile, likes }) => (
                  <div
                    key={_id}
                    className={{ margin: '20px', cursor: 'pointer' }}
                    onClick={() => openPost(_id)}
                  >
                    <Typography gutterBottom variant='h6'>
                      {title}
                    </Typography>
                    <Typography gutterBottom variant='subtitle2'>
                      {name}
                    </Typography>
                    <Typography gutterBottom variant='subtitle2'>
                      {message.length > 120
                        ? message.substring(0, 120) + '...'
                        : message}
                    </Typography>
                    <Typography gutterBottom variant='subtitle1'>
                      {likes.length} like{likes.length > 1 ? 's' : ''}
                    </Typography>
                    <img
                      src={selectedFile || placeholder}
                      width='180px'
                      height='180px'
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        ) : (
          ''
        )}
      </Paper>
  );
};
