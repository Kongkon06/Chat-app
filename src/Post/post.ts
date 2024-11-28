import express from "express";
import { Comments, Posts } from "../db";

const Post = express.Router();

Post.get('/', async (req, res) => {
  try {
    const users = await Posts.aggregate([
      {
        $lookup: {
          from: 'users', 
          localField: 'userId',
          foreignField: '_id', 
          as: 'userInfo' 
        }
      }
    ]);
    res.json({posts:users});
  } catch (e) {
    res.status(411).json({ msg: "Error while finding users: " + e });
  }
})

Post.post('/userpost',async (req,res)=> {
  const userId = req.body.userId;
  try{
    const data = await Posts.findMany({userId:userId});
      res.json({userpost:data});
      return;
  }catch(e){
    res.status(500).json({
      msg:"error while searching post"
    })
  }
})
Post.post('/', async (req, res) => {
  const content = req.body.content;
  const userId = req.body.userId;
  const date = new Date;
  try {
    await Posts.create({
      userId: userId,
      content: content,
      date: date
    })
    res.json({
      msg: "post created sucessfully"
    })
  } catch (e) {
    res.status(500).json({
      msg: "Error while creating post " + e
    })
  }
})
Post.delete('/', async (req, res) => {
  const postId = req.body.postId;
  try {
    await Posts.delete({
      _id: postId
    })
    res.json({
      msg: "Post deleted"
    })
  } catch (e) {
    res.json({
      msg: "error while deleting posts " + e
    })
  }
  res.json();
})
Post.put('/edit', async (req, res) => {
  const postId = req.body.postId;
  const content = req.body.content;
  try {
    await Posts.updateOne({
      _id: postId
    }, {
      content: content
    })
    res.json({ msg: "post updated sucessfully" })
  } catch (e) {
    res.status(500).json({
      msg: "error while updating post" + e
    })
  }
})
Post.put('/comment', async (req, res) => {
  const { postId, content } = req.body;
  try {
    await Comments.create({
      postId: postId,
      content: content
    })
    res.json({ msg: "Comment created" });
  } catch (e) {
    res.status(500).json({ msg: "error while creating commnet" });
  }
  res.json();
})
Post.put('/likes', async (req, res) => {
  const userId = req.body.userId;
  const postId = req.body.psotId;
  try {
    const update = await Posts.updateOne(
      { _id: postId },
      { $push: { likes: userId } }
    )
    res.json({
      msg: "Done"
    })
  } catch (e) {
    res.status(500).json({
      msg: "error while updateing likes " + e
    });
  }
})

export default Post;