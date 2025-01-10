import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios'

import 'easymde/dist/easymde.min.css';
import styles from './addPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';

export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const inputFileRef = React.useRef(null)
  const isEditing = Boolean(id)

  const onSubmit = async() => {
    try{
      setLoading(true)
      
      const fields = {
        title,
        imageUrl,
        tags: tags.split(',').map((tag) => tag.trim()),
        text,
      }
      const { data } = isEditing
      ? await axios.patch(`/posts/${id}`, fields)
      : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id

      navigate(`/posts/${_id}`)
    } catch(err) {
      console.error('Ошибка запроса:', err.response ? err.response.data : err);
      alert('Ошибка созданий статьи!')
    }
  }

  const handleChangeFile = async(event) => {
    console.log(event.target.files)
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const {data} = await axios.post('/upload', formData)
      setImageUrl(data.url)
    } catch (err) {
      console.warn(err)
      alert('Ошибка при загрузке файла!')
    }
  };

  React.useEffect(() => {
    if(id) {
      axios.get(`/posts/${id}`)
      .then(({ data }) => {
        setTitle(data.title)
        setText(data.text)
        setImageUrl(data.imageUrl)
        setTags(data.tags.join(','))
      })
       .catch ((err) => {
        console.warn(err)
        alert('Ошибка при получений статьи!')
      }) 
    }
  }, [id])

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const isAuth = useSelector(selectIsAuth)

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
        uniqueId: 'add-post-editor',
      },
    }),
    [],
  );

  if(!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />
  }
 
  console.log('Отправляемые данные:', { title, imageUrl, tags, text });

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
          <img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField 
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth 
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
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
