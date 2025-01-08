import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

      const uniqueTags = [...new Set(tags)];

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true } 
    ).populate('user')

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }
    
    res.json(doc);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не удалось вернуть статью',
    })
  }
};

// удоление статьи


export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    // удоление статьи

    const post = await PostModel.findOneAndDelete({ _id: postId });

    if (!post) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};

// создание статьи

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

// обновление статьи

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(','),
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};


export const getPopularPosts = async (req, res) => {
  try{
    const posts = await PostModel.find().sort({ viewsCount: -1 }).exec()
    res.json(posts)
  }catch(err) {
    console.error(err)
    res.status(500).json({
      message: 'Не удалось получить популярные посты'
    })
  }
}