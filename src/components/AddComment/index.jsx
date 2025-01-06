import React, { useState } from "react";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";


export const AddComment = ({ onAddComment, userName }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onAddComment(text); 
      setText(""); 
    }
  };

  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src="https://mui.com/static/images/avatar/5.jpg"
      />
      <div>{userName}</div>
      <div className={styles.form}>
        <TextField
          label="Написать комментарий"
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)} 
        />
        <Button
          variant="contained"
          onClick={handleSubmit} 
        >
          Отправить
        </Button>
      </div>
    </div>
  );
};
