import React, { useEffect } from 'react';
import { Pagination, PaginationItem } from '@material-ui/lab';
import useStyles from './styles';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, getPostsBySearch } from '../actions/posts';

const Paginate = ({ page, searchQuery }) => {
  const { currentPage, numberOfPages } = useSelector(({ posts }) => posts);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchQuery.title || searchQuery.tags) {
      dispatch(
        getPostsBySearch({
          searchpage: searchQuery.searchpage,
          title: searchQuery.title,
          tags: searchQuery.tags,
        }),
      );
    } else {
      dispatch(getPosts(page));
    }
  }, [page, searchQuery.searchpage, searchQuery.title, searchQuery.tags]);

  return (
    <Pagination
      className={classes.ul}
      count={numberOfPages}
      page={currentPage || 1}
      size='medium'
      variant='outlined'
      color='primary'
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={
            !searchQuery.title
              ? `/posts?page=${item.page}`
              : `/posts/search?searchpage=${item.page}&title=${searchQuery.title}&tags=${searchQuery.tags}`
          }
        />
      )}
    />
  );
};

export default Paginate;
