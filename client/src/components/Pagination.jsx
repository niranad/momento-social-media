import React, { useEffect } from 'react';
import { Pagination, PaginationItem } from '@material-ui/lab';
import useStyles from './styles';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../actions/posts';

const Paginate = ({ page }) => {
  const { numberOfPages } = useSelector(({ posts }) => posts);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (page) {
      dispatch(getPosts(page));
    }
  }, [page]);

  return (
    <Pagination
      className={classes.ul}
      count={numberOfPages}
      page={Number(page) || 1}
      variant='outlined'
      color='primary'
      renderItem={(item) => (
        <PaginationItem {...item} component={Link} to={`/posts?page=${item.page}`} />
      )}
    />
  );
};

export default Paginate;
