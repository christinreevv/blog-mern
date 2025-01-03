import { body } from 'express-validator';

export const registerValidation = [
    body('fullName', 'Укажите имя').isLength( {min: 3 }),
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('imageUrl', 'Неверная ссылка на аватарку').optional().isURL(),
]