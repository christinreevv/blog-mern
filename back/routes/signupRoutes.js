import express from 'express';
import nodemailer from 'nodemailer';
import Post from '../models/Post.js'; 
import Signup from '../models/Signup.js';

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 587,
  secure: false,
  auth: {
    user: 'ndreevaa@mail.ru',
    pass: 'yRDxM0sVXr4FTkv5cb8K',
  },
});

router.post('/api/signup', async (req, res) => {
  const { email, postId } = req.body;

  if (!email || !postId) {
    return res.status(400).json({ message: 'Некорректные данные' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Конкурс не найден' });
    }

    const existingSignup = await Signup.findOne({ email, postId });
    if (existingSignup) {
      return res.status(400).json({ message: 'Вы уже записаны на этот конкурс' });
    }

    const newSignup = new Signup({ email, postId });
    await newSignup.save();

    await transporter.sendMail({
      from: 'ndreevaa@mail.ru',
      to: email,
      subject: `Подтверждение записи на конкурс: ${post.title}`,
      text: `Вы успешно записались на конкурс "${post.title}".\n\nОписание: ${post.text}\nДата и время проведения: ${post.date}\nМесто проведения: ${post.place}`,
      html: `
        <h2>Вы успешно записались на конкурс ${post.title}</h2>
        <p><strong>Описание:</strong> ${post.text}</p>
        <p><strong>Дата и время проведения:</strong> ${post.date}</p>
        <p><strong>Место проведения:</strong> ${post.place}</p>
        <p>Мы Вас ждем!</p>
      `,
    });

    res.json({ message: 'Вы успешно записались на конкурс! Проверьте почту.' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при записи. Попробуйте снова.' });
  }
});


export default router;
