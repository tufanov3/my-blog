import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { AddComment } from "../components/AddComment"; 
import { CommentsBlock } from "../components/comments/CommentsBlock";
import axios from "../axios";

export const FullPost = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [isCommentLoading, setIsCommentLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if(!id) {
      console.warn("no ID")
    }
    console.log(id)
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении статьи");
      });
  }, [id]);

  useEffect(() => {
    if(!id) {
      console.warn("no ID")
    }
    axios
      .get(`/posts/${id}/comments`)
      .then((res) => {
        setComments(res.data);
        setIsCommentLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении комментариев");
      });
  }, [id]);

  const handleAddComment = async (text) => {
    if(!id) {
      console.warn("no ID")
    }
    try {
      const { data: newComment } = await axios.post(`/posts/${id}/comments`, {
        text,
      });
      setComments((prev) => [...prev, newComment]);
    } catch (err) {
      console.warn(err);
      alert("Ошибка при добавлении комментария");
    }
  };

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length}
        tags={data.tags}
        user={data.user}
        isFullPost
      >
        <p>{data.text}</p>
      </Post>
      <CommentsBlock items={comments} isLoading={isCommentLoading}>
        <AddComment onAddComment={handleAddComment} />
      </CommentsBlock>
    </>
  );
};
