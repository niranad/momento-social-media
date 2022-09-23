import React, { useEffect } from 'react';
import {
  Paper,
  CircularProgress,
  Divider,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@material-ui/core';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection';
import placeholder from '../../images/placeholder.jpg';
import useStyles from './styles';
import useStyles2 from '../Posts/Post/styles';
import PostDetailsSkeleton from './PostDetailsSkeleton';

export default function PostDetails() {
  const { post, postsData, isLoading } = useSelector(({ posts }) => posts);
  const classes = useStyles();
  const classes2 = useStyles2();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    if (post) {
      dispatch(
        getPostsBySearch({
          title: 'none',
          tags: post?.tags.join(','),
        }),
      );
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
          <Typography variant='h3' component='h3'>
            {post?.title}
          </Typography>
          <Typography
            gutterBottom
            variant='h6'
            color='textSecondary'
            component='h6'
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
            color='textSecondary'
          >
            <strong>{post.name}</strong>
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
        <Grid
          className={classes.recommended}
          alignItems='stretch'
          container
          spacing={2}
        >
          <Grid item xs={12} sm={12}>
            <Typography gutterBottom variant='h5'>
              <ThumbUpRoundedIcon /> <strong>You might also like:</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Divider />
          </Grid>
          {recommendedPosts.map(
            ({ title, message, name, _id, selectedFile, likes }) => (
              <Grid item xs={12} sm={6} md={4} raised elevation={3}>
                <Card
                  key={_id}
                  className={classes.recommendedCard}
                  styles={{ height: '80px' }}
                  onClick={() => openPost(_id)}
                >
                  <CardContent className={classes2.cardContent}>
                    <Typography gutterBottom variant='h6'>
                      {title}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant='subtitle1'
                      color='textSecondary'
                    >
                      <strong>{name}</strong>
                    </Typography>
                    <Typography gutterBottom variant='subtitle2'>
                      {message.length > 120
                        ? message.substring(0, 120) + '...'
                        : message}
                    </Typography>
                    <Typography gutterBottom variant='subtitle2' color='textSecondary'>
                      {likes.length} like{likes.length > 1 ? 's' : ''}
                    </Typography>
                  </CardContent>
                  <CardMedia
                    className={classes.recommendedMedia}
                    image={selectedFile || placeholder}
                    title='Post Image'
                  />
                </Card>
              </Grid>
            ),
          )}
        </Grid>
      ) : (
        ''
      )}
    </Paper>
  );
}
