import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from 'react-redux';
import Button from "@mui/material/Button";
import { Navigate } from "react-router-dom";
import { selectIsAuth } from '../../redux/slices/auth'
import { useForm } from 'react-hook-form'

import styles from "./login.module.scss";
import { fetchAuth } from "../../redux/slices/auth";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()

  const{register, handleSubmit, formState: {errors, isValid}} = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  })

  const onSubmit = async(values) => {
  const data = await dispatch(fetchAuth(values))


    if(!data.payload) {
      return alert('Не удалось авторизоваться')
    }
    if('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  if(isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
     <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
          className={styles.field}
          label="E-Mail"
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", {required: 'Укожите почту'})}
          fullWidth
        />
        <TextField
         className={styles.field}
         error={Boolean(errors.password?.message)}
         label="Пароль" fullWidth
          {...register("password", {required: 'Укожите пароль'})}
          helperText={errors.password?.message}
            />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
     </form>
    </Paper>
  );
};
