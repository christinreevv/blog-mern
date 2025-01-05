import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    // checking for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    // encrypting the hash
    const password = req.body.password; // пароль, который отправил пользователь
    /* далее используется библиотека bcrypt для защиты пароля */
    const salt = await bcrypt.genSalt(10); // генерируется "соль" (дополнительные случайные данные)
    const hash = await bcrypt.hash(password, salt); // пароль шифруется вместе с "солью", чтобы повысить защиту

    // create document
    const doc = new UserModel({
      // создаётся новый объект пользователя с помощью модели UserModel
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash, // пароль сохраняется в зашифрованном виде, а не в чистом тексте
    });

    // create document in DB
    const user = await doc.save(); // объект сохраняется в базе данных
    // user — это данные, которые вернула база после сохранения

    const token = jwt.sign(
      {
        // с помощью библиотеки JWT внутри токена сохраняется id пользоваетля
        _id: user._id,
      },
      "secret123", // токен подписывается секретным ключом
      {
        expiresIn: "30d", // срок действия токена - 30 дней
      }
    );

    const { passwordHash, ...userData } = user._doc;

    // ответ клиенту в виде JSON-объекта с данными пользователя и токеном
    res.json({
      ...userData, // ...user._doc — это распаковка данных пользователя из базы
      token,
    });
  } catch (err) {
    // обработка ошибок
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Введите email и пароль",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign({ _id: user._id }, "secret123", {
      expiresIn: "30d",
    });

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось авторизироваться",
    });
  }
};

export const getProfile = async (req, res) => {
    try {
      const user = await UserModel.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({
          message: "Пользователь не найден",
        });
      }
  
      const { passwordHash, ...userData } = user._doc;
  
      res.json(userData);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Нет доступа",
      });
    }
  };
  