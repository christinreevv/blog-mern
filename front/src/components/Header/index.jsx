import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout, selectIsAuth } from '../../redux/slices/auth';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector((state) => state.auth.data); // Получаем данные юзера
  const isAdmin = user?.role === 1; // Проверяем роль

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Развитие+</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                {isAdmin && ( // Показываем кнопку только админам
                  <Link to="/add-post">
                    <Button variant="contained">Написать статью</Button>
                  </Link>
                )}
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined"
                     sx={{
                      backgroundColor: 'transparent',
                      color: '#9E2C2C',
                      border: '1px solid #9E2C2C',
                      '&:hover': {
                        backgroundColor: '#5B1818',
                        border: 'none',
                         color: 'white',
                      },
                    }}
                    >Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained"
                  
                  sx={{
                    backgroundColor: '#9E2C2C',
                    color: 'white',
                    borderColor: 'none',
                    '&:hover': {
                      backgroundColor: '#5B1818',
                    },
                  }}>Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
