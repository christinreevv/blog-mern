// 1
import express from "express";
import mongoose from "mongoose";

import { registerValidation, loginValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from './controllers/UserController.js';

// --------------------------- DB connect ---------------------------

mongoose
  .connect(
    "mongodb+srv://root:root@christinreev.gklin.mongodb.net/blog?retryWrites=true&w=majority&appName=christinreev"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("BD error", err));

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
  console.log("Server OK");
});

// --------------------------- Registration ---------------------------

// 1 аргумент: создание маршрута для обработки POST-запросов
// 2 аргумент: проверка входящих данных (/validations/auth.js)
// 3 аргумент: асинхронная функция, которая обрабатывает запрос

app.post("/auth/register", registerValidation, UserController.register);
// --------------------------- Login ---------------------------

app.post("/auth/login", loginValidation, UserController.login);

// --------------------------- Profile ---------------------------

app.get("/auth/profile", checkAuth, UserController.getProfile);
