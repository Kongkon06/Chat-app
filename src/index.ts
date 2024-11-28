import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET, Parseword } from "./config";
import { Users, Posts, Comments } from './db';
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
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

    console.log(users);
    res.json({posts:users});
  } catch (e) {
    res.status(411).json({ msg: "Error while finding users: " + e });
  }
});



app.post('/', async (req: Request, res: Response) => {

  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  console.log(req.body);
  try {
    console.log("inside try");
    const token = jwt.sign({ username }, JWT_SECRET);
    console.log("inside try")
    const hashedpassword = await bcrypt.hash(password, 10);
    await Users.create({
      name: name,
      username: username,
      email: email,
      password: hashedpassword
    });

    res.json({ msg: "User created successfully", token: token });
    return
  } catch (e) {
    console.error("Error creating user:", e);  // Log the error
    res.status(500).json({ msg: "Error creating user" });  // Remove JWT from error response
  }
  return;
})
app.post('/signin', async (req, res) => {
  const username = req.body.username;
  const password= req.body.password;

  try {
    const user = await Users.findOne({ username:username });
    if (user) {
      console.log(user.password + " " + password);
      const reslt = await bcrypt.compare(password,user.password);
      if (!reslt) {
        res.status(411).json({ msg: "password error"+ reslt });
        return;
      }
      const token = jwt.sign(JWT_SECRET, user.username);
      res.json({ userId:user._id,username:user.username,token: token });
      return;
    }
  } catch (e) {
    res.status(500).json({ msg: "Username dosent exit" +e});
  }

})
app.post('/post', async (req, res) => {
  const userId = req.body.userId;
  const content = req.body.content;
  const date = new Date ;
  try {
    await Posts.create({
      userId: userId,
      content: content,
      date: date
    })
    res.json({ msg: "Post sucessfully created" });
  } catch (e) {
    res.status(500).json({ msg: "Error while creating posts" });
  }
  return
})

app.post('/comment', async (req, res) => {
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

})
app.post('/follow', (req, res) => {
  const { userId } = req.body;
  if (Users.find({ userId: userId })) {

  }
})

app.post('/likes', async (req, res) => {
  const { postId, userId } = req.body;
  try {
    await Posts.findOneUpdate({ postId: postId }, {
      $push: { like: userId }
    })
  } catch (e) {
    res.status(500).json({ msg: "Error while updating post" });
  }
})
app.listen(3000, () => {
  console.log("Server is running")
});
module.exports = {
  app
}