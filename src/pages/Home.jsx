import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/comments/CommentsBlock';
import { fetchPopularPosts, fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
  const [tabIndex, setTabIndex] = React.useState(0); 
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  const handleChange = (event, newValue) => {
    setTabIndex(newValue); 
  };

  React.useEffect(() => {
    if (tabIndex === 0) {
      dispatch(fetchPosts()); 
    } else {
      dispatch(fetchPopularPosts()); 
    }
    dispatch(fetchTags()); 
  }, [dispatch, tabIndex]);

  const sortedPosts = tabIndex === 1
    ? [...posts.items].sort((a, b) => b.viewsCount - a.viewsCount)
    : posts.items;

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={tabIndex} 
        onChange={handleChange} 
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : sortedPosts).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={new Date(obj.createdAt).toLocaleDateString()}
                viewsCount={obj.viewsCount}
                commentsCount={obj.commentsCount}
                tags={obj.tags}
                isLoading={false}
                isEditable={userData?._id === obj.user._id}
/>
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
