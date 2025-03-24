import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [age, setAge] = useState('');
  const [specialization, setSpecialization] = useState('');
  const inputFileRef = useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла!');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
        date,
        place,
        age,
        specialization,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи!');
    }
  };

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:5010${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        inputProps={{ maxLength: 100 }} // Ограничение на количество символов
      />

      <TextField value={tags} onChange={(e) => setTags(e.target.value)} classes={{ root: styles.tags }} variant="standard" placeholder="Тэги" fullWidth />
      <TextField value={date} onChange={(e) => setDate(e.target.value)} classes={{ root: styles.date }} variant="standard" placeholder="Дата" fullWidth />
      <TextField value={place} onChange={(e) => setPlace(e.target.value)} classes={{ root: styles.place }} variant="standard" placeholder="Место" fullWidth />
      <TextField value={age} onChange={(e) => setAge(e.target.value)} classes={{ root: styles.age }} variant="standard" placeholder="Возраст" fullWidth />
      <TextField value={specialization} onChange={(e) => setSpecialization(e.target.value)} classes={{ root: styles.specialization }} variant="standard" placeholder="Специализация" fullWidth />
      
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={(value) => setText(value)} // Обработка изменения текста
        options={{
          spellChecker: false,
          maxHeight: '400px',
          autofocus: false, // Убираем автозапуск, чтобы не сбивать курсор
          placeholder: 'Введите текст...',
          status: false,
          autosave: { enabled: true, delay: 1000, uniqueId: 'myUniqueId' }, // Устанавливаем уникальный ID для автосохранения
        }}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
