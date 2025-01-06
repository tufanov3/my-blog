import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByTag } from "../redux/slices/posts";
import { Post } from "../components/Post";

export const TagsPosts = () => {
  const { tag } = useParams(); // Получаем тег из URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts } = useSelector((state) => state.posts); // Данные о постах
  const isPostsLoading = posts.status === "loading"; // Проверка статуса загрузки

  useEffect(() => {
    if (tag) {
      dispatch(fetchPostsByTag(tag)); // Загружаем посты по тегу
    }
  }, [dispatch, tag]);

  const handlePostClick = (id) => {
    navigate(`/posts/${id}`); // Переход на страницу полного поста
  };

  return (
    <div>
      <h1>Посты с тегом: {tag}</h1>
      {isPostsLoading ? (
        <p>Загрузка...</p>
      ) : (
        posts.items.map((post) => (
          <Post
            key={post._id}
            id={post._id}
            title={post.title}
            imageUrl={post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ""}
            user={post.user}
            createdAt={new Date(post.createdAt).toLocaleDateString()}
            viewsCount={post.viewsCount}
            commentsCount={post.commentsCount} // Отображаем количество комментариев
            tags={post.tags}
            onClick={() => handlePostClick(post._id)} // Переход к полному посту
          />
        ))
      )}
    </div>
  );
};
