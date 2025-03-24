import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { fetchPosts } from '../redux/slices/posts';
import axios from 'axios';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === 'loading';

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Вычисляем теги из постов
  const tags = Array.from(new Set(posts.items.flatMap((post) => post.tags)));

  // Функция записи на конкурс
  const handleSignup = async (postId) => {
    if (!userData) {
      alert('Вы должны быть авторизованы, чтобы записаться.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5010/api/signup', {
        email: userData.email,
        postId,
      });

      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка при записи. Попробуйте снова.');
    }
  };

  // Функция удаления поста (только для админа)
  const handleDelete = async (postId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      try {
        await axios.delete(`http://localhost:5010/api/posts/${postId}`);
        alert('Пост удален');
        dispatch(fetchPosts()); // Перезагружаем список постов
      } catch (error) {
        alert('Ошибка при удалении поста');
      }
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={8}>
        {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
          isPostsLoading ? (
            <Post key={index} isLoading={true} />
          ) : (
            <div key={obj._id}>
              <Post
                id={obj._id}
                title={obj.title}
                text={obj.text}
                date={`Даты проведения: ${obj.date}`}
                place={`Место проведения: ${obj.place}`}
                specialization={`Специальность: ${obj.specialization}`}
                age={`Возрастная категория: ${obj.age}`}
                imageUrl={obj.imageUrl ? `http://localhost:5010${obj.imageUrl}` : ''}
                user={obj.user}
                viewsCount={obj.viewsCount}
                tags={obj.tags}
              />

              {userData && (
                <div style={{ marginTop: 10, marginBottom: 30 }}>
                  {userData.role === 1 ? ( // Если админ
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(obj._id)}
                      sx={{
                        backgroundColor: '#D32F2F',
                        color: 'white',
                        '&:hover': { backgroundColor: '#9E2C2C' },
                      }}
                    >
                      Удалить
                    </Button>
                  ) : (
                    // Если обычный пользователь
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSignup(obj._id)}
                      sx={{
                        backgroundColor: '#9E2C2C',
                        color: 'white',
                        '&:hover': { backgroundColor: '#5B1818' },
                      }}
                    >
                      Записаться
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </Grid>
      <Grid item xs={4}>
        <TagsBlock items={tags} isLoading={isPostsLoading} />
      </Grid>
    </Grid>
  );
};
