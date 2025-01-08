import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
      text: {
        type: String,
        required: true,
      },
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      userName: {
        type: String, 
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    } 
  )

  export default mongoose.model('Comment', CommentSchema);