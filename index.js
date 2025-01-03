// 1 
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator'; 

import { registerValidation } from './validations/auth.js';
import UserModel from './models/User.js';

// --------------------------- DB connect ---------------------------

mongoose.connect('mongodb+srv://root:root@christinreev.gklin.mongodb.net/blog?retryWrites=true&w=majority&appName=christinreev')
 .then( () => console.log('DB OK'))
 .catch( (err) => console.log('BD error', err));
 
// --------------------------- Server settings --------------------------- 

// 2
const app = express();

// 4 
// express приложение не знает, что такое JSON и чтобы он сумел прочитать JSON-запросы, нужно:
app.use(express.json()); // позволяем читать JSON который будет приходить в наши запросы

//3
const DEFAULT_PORT = 5002;

app.listen(DEFAULT_PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
});

// --------------------------- Registration --------------------------- 


// 1 аргумент: создание маршрута для обработки POST-запросов
// 2 аргумент: проверка входящих данных (/validations/auth.js)
// 3 аргумент: асинхронная функция, которая обрабатывает запрос

app.post('/auth/register', registerValidation, async (req, res) => {

    try {
        // checking for errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
        }
        
        // encrypting the hash
        const password = req.body.password; // пароль, который отправил пользователь
        /* далее используется библиотека bcrypt для защиты пароля */
        const salt = await bcrypt.genSalt(10); // генерируется "соль" (дополнительные случайные данные)
        const passwordHash = await bcrypt.hash(password, salt); // пароль шифруется вместе с "солью", чтобы повысить защиту

        // create document
        const doc = new UserModel ({ // создаётся новый объект пользователя с помощью модели UserModel
            email: req.body.email, 
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash, // пароль сохраняется в зашифрованном виде, а не в чистом тексте
        }); 

        // create document in DB
        const user = await doc.save(); // объект сохраняется в базе данных
        // user — это данные, которые вернула база после сохранения

        const token = jwt.sign({ // с помощью библиотеки JWT внутри токена сохраняется id пользоваетля
            _id: user._id,
        }, 'secret123', // токен подписывается секретным ключом
    { 
        expiresIn: '30d', // срок действия токена - 30 дней
    }
    );

    // ответ клиенту в виде JSON-объекта с данными пользователя и токеном
        res.json({
            ...user._doc, // ...user._doc — это распаковка данных пользователя из базы
            token
        });
    } 

    // обработка ошибок
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        });
    };
});