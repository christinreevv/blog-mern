import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteFilledIcon from '@mui/icons-material/Favorite';

import styles from './Post.module.scss';
import { PostSkeleton } from './Skeleton';
import { fetchRemovePost } from '../../redux/slices/posts';

const reactionsList = ["❤️", "👾", "👎🏻", "🤩", "👍🏻"];

export const Post = ({
  id,
  title,
  text,
  specialization,
  date,
  place,
  age,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();
  
  const [selectedReaction, setSelectedReaction] = useState(() => localStorage.getItem(`reaction_${id}`) || "👍");
  const [likesCount, setLikesCount] = useState(() => JSON.parse(localStorage.getItem(`likes_${id}`)) || 0);
  const [isLiked, setIsLiked] = useState(() => JSON.parse(localStorage.getItem(`isLiked_${id}`)) || false);
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    localStorage.setItem(`reaction_${id}`, selectedReaction);
    localStorage.setItem(`likes_${id}`, JSON.stringify(likesCount));
    localStorage.setItem(`isLiked_${id}`, JSON.stringify(isLiked));
  }, [selectedReaction, likesCount, isLiked, id]);

  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить статью?')) {
      dispatch(fetchRemovePost(id));
    }
  };

  const onLikeClick = () => {
    const newIsLiked = !isLiked;
    const storedLikes = JSON.parse(localStorage.getItem(`likes_${id}`)) || 0;
    const updatedLikes = newIsLiked ? storedLikes + 1 : Math.max(storedLikes - 1, 0);
  
    setIsLiked(newIsLiked);
    setLikesCount(updatedLikes);
  
    localStorage.setItem(`isLiked_${id}`, JSON.stringify(newIsLiked));
    localStorage.setItem(`likes_${id}`, JSON.stringify(updatedLikes));
  };
  

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img className={clsx(styles.image, { [styles.imageFull]: isFullPost })} src={imageUrl} alt={title} />
      )}
      <div className={styles.wrapper}>
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <p className={styles.mainText}>Описание: {text}</p>
          <p className={styles.mainText}>{specialization}</p>
          <p className={styles.mainText}>{date}</p>
          <p className={clsx(styles.mainText, styles.fadedText)}>{place}</p>
          <p className={clsx(styles.mainText, styles.fadedText)}>{age}</p>

          <ul className={styles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <a>#{name}</a>
              </li>
            ))}
          </ul>

          {children && <div className={styles.content}>{children}</div>}

          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            
            <li className={styles.likeContainer} onClick={onLikeClick}>
              <IconButton>
                {isLiked ? <FavoriteFilledIcon color="error" /> : <FavoriteIcon />}
              </IconButton>
              <span>{likesCount}</span>
            </li>

            <li
              className={styles.reactionContainer}
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setTimeout(() => setShowReactions(false), 500)}
            >
              <span className={styles.selectedReaction}>{selectedReaction}</span>
              {showReactions && (
                <div 
                  className={styles.reactionsPopup} 
                  onMouseEnter={() => setShowReactions(true)} 
                  onMouseLeave={() => setTimeout(() => setShowReactions(false), 500)}
                >
                  {reactionsList.map((reaction) => (
                    <span
                      key={reaction}
                      className={styles.reaction}
                      onClick={() => setSelectedReaction(reaction)}
                    >
                      {reaction}
                    </span>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
