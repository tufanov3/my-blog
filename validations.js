import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
  body('fullName', 'Укажите имя').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];


export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isString({ min: 3 }),
  body('text', 'Введите текст статьи').isString({ min: 3 }),
  body('tags', 'Неверный формат тэгов (укажите массив)').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изоброжение').optional().isString(),
];
