import express from "express";
import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import { Messages, Users } from "../db";
const { ObjectId } = require("mongoose").Types;
const { Types } = require("mongoose");
const User = express.Router();

User.post('/userInfo',async (req,res)=>{
    const username = req.body.username;
    try{
        const user = await Users.aggregate([
          {
            $match: { username: username }
          },
          {
            $lookup:{
              from:'posts',
              localField:'_id',
              foreignField:'userId',
              as:'posts'
            }
          },
          {
            $project: {
              name: 1,
              username: 1, 
              userId: 1,
              followers: 1, 
              Bio: 1, 
        
              "posts.content": 1, 
              "posts.likes": 1 
            }        
          }
        ]);
        if(user){
            res.json({data:user});
        }else{
            res.status(500).json({msg:"user doesnt exist"});
        }
    }catch(e){
        res.status(411).json({
            msg:"user dosent exist" + e
        });
    }
})

User.post('/Checkmessages',async (req,res)=>{ //these route will send the new useen messages and also
  const userId = req.body.userId;  
  try{
    const Messageobject = await Messages.findOne({
      $or: [
        { "connection.user1": userId },
        { "connection.user2": userId }
      ],
    });
    res.json({msg:Messageobject});
  }catch(e){
    res.status(500).json({
      msg:"error while acessing past messages"
    })
  }
})

User.post('/test',async (req,res)=>{
  const {userId} = req.body;
  if(!userId){
    res.json({msg:"give userid"});
    return
  }
  const Messageobject = await Messages.find({
    connection: { $in: [userId] },
  });
  res.json({msg:Messageobject});
})
User.post('/signup',async (req,res)=>{
    const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  console.log(req.body);
  try {
    const token = jwt.sign({ username }, JWT_SECRET);
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

User.post('/signin',async (req,res) =>{
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
        res.json({ userId:user._id,username:user.username,followed:user.followed,follwer:user.followers,token: token });
        return;
      }
    } catch (e) {
      res.status(500).json({ msg: "Username dosent exit" +e});
    }
})
User.put('/profile',async (req,res) =>{
    const userId = req.body.userId;
    const username = req.body.username;
    const bio = req.body.bio;
    try{
   await Users.updateOne({
    _id:userId
   },{
    username: username,
    Bio:bio
   })
    }catch(e){

    }
    res.json({});
})
User.put('/credentials',async (req,res) =>{
  const userId = req.body.userId;
  const email = req.body.email;
  const password = req.body.bio;
  try{
  await Users.updateOne({
    _id: userId
  },{
    email:email,
    password:password
  })
  }catch(e){
    res.status(500).json({
      msg:"error while updating credentials"
    })
  }
  res.json({});
})
User.put('/follow',async(req,res)=>{
    console.log(req.body);
    const userId = req.body.userId;
    const followerId = req.body.followerId;
    try{
       await Users.updateOne({_id: userId},{
        $push:{followers:followerId}
      });
      res.json({
        msg:"follower added"
      })
    }catch(e){
      res.status(500).json({
        msg:"error while adding follower " + e
      })
    }
     
})
User.delete('/',async (req,res)=>{
    const userId = req.body.userId
    try{
        const user = await Users.delete({
            _id:userId
        });
    res.json({msg:"User deleted sucessfully"});
    }catch(e){
        res.status(500).json({
            msg:"Error while deleting user " + e
        })
    }
    res.json({})
})
export default User;