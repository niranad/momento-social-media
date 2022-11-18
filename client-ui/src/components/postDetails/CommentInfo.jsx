import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import useStyles from './styles';

export default function CommentInfo ({ comment, index }) {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const value = comment?.split(': ')[1];
  const [displayComment, setDisplayComment] = useState(
    value?.length > 70 ? value?.substring(0, 70) + '...' : value,
  );

  const toggleComment = (e) => {
    e.stopPropagation();
    if (value.length > 70) {
      if (!isExpanded) {
        setIsExpanded((isExpanded) => !isExpanded);
        setDisplayComment(value.substring(0, 70) + '...');
      } else {
        setIsExpanded((isExpanded) => !isExpanded);
        setDisplayComment(value);
      }
    }
  };

  return (
    <div
      key={index}
      className={classes.comment}
      title={displayComment !== value ? 'Click to expand content' : ''}
      onClick={toggleComment}
    >
      <Typography style={{ fontWeight: 600 }} gutterBottom variant='h6'>
        {comment.split(': ')[0]}
      </Typography>
      <Typography gutterBottom variant='p'>
        {displayComment}
      </Typography>
    </div>
  );
};
