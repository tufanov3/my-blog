import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { fetchRemovePost } from "./auth";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async() => {
    const { data } = await axios.get('/posts')
    return data
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async() => {
    const { data } = await axios.get('/tags')
    return data
})

export const fetchComments = createAsyncThunk('comments/fetchComments', async(postId) => {
    const {data} = await axios.get(`/posts/${postId}/comments`)
    return data
})

export const addComment = createAsyncThunk('comments/addComments', async(postId, text) => {
    const {data} = await axios.post(`/posts/${postId}/comments`, {text})
    return data
})


export const removeComment = createAsyncThunk('comments/removeComments', async(commentId) => {
    await axios.delete(`/comments/${commentId}`)
    return commentId
})

export const fetchPopularPosts = createAsyncThunk('posts/fetchPopularPosts', async() => {
    const { data } = await axios.get('/posts/popular')
    return data
})

export const fetchPostsByTag = createAsyncThunk(
    'posts/fetchPostsByTag',
    async (tag) => {
      const response = await axios.get(`/posts/tags/${tag}`);
      console.log('Response from server:', response.data);
      return response.data;
    }
  );

const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    },
    comments: {
        items: [],
        status: 'loading'
    }
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: {
        // Получение статей
        [fetchPosts.pending]: (state) => {
            state.posts.items = []
            state.posts.status = 'loading'
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload
            state.posts.status = 'loaded'
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = []
            state.posts.status = 'error'
        },
                // Получение тэгов
        [fetchTags.pending]: (state) => {
            state.tags.items = []
            state.tags.status = 'loading'
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload
            state.tags.status = 'loaded'
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = []
            state.tags.status = 'error'
        },
        // Удаление

        [fetchRemovePost.pending]: (state, aciton) => {
            state.posts.items = state.posts.items.filter(obj => obj._id !== aciton.meta.arg)
        },

        // получение коментариев

        [fetchComments.pending]: (state) => {
            state.comments.items = []
            state.comments.status = 'loading'
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.comments.items = action.payload
            state.comments.status = 'loaded'
        },
        [fetchComments.rejected]: (state) => {
            state.comments.items = []
            state.comments.status = 'error'
        },

        // добавление коментариев

        [addComment.fulfilled]: (state, action) => {
            const { postId, comment } = action.payload
            const post = state.posts.items.find(post => post._id === postId)
            if(post) {
                post.comments.push(comment)
            }
        },

        [removeComment.fulfilled]: (state, action) => {
            const commentId = action.payload
            state.comments.items = state.comments.items.filter(comment => comment._id !== commentId)
        },

        [fetchPostsByTag.pending]: (state, action) => {
            state.posts.items = [];
            state.posts.status = "loading";
          },
          [fetchPostsByTag.fulfilled]: (state, action) => {
            console.log('Fetched posts:', action.payload)
            state.posts.items = action.payload;
            state.posts.status = "loaded";
          },
          [fetchPostsByTag.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = "error";
          },
    }
})

export const postsReducer = postsSlice.reducer