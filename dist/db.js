"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = exports.Comments = exports.Posts = exports.Users = void 0;
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://kbora3525:2sDqFuGV58pZn7OU@cluster0.h7qbblx.mongodb.net/Social");
const { Schema } = mongoose;
// User schema
const userSchema = new Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    followed: [{
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }],
    followers: [{
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }],
    Bio: String,
});
// Post schema
const postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    content: String,
    date: String,
    likes: [{
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }]
});
const commentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Posts', // Referencing the Posts model here
        required: true
    },
    content: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
});
const messageSchema = new Schema({
    connection: {
        user1: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        }, user2: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        }
    },
    messages: [{
            content: String,
            author: {
                type: Schema.Types.ObjectId,
                ref: 'Users',
                required: true
            },
            seen: {
                type: Boolean,
                default: false
            }
        }]
});
exports.Users = mongoose.model("Users", userSchema);
exports.Posts = mongoose.model("Posts", postSchema);
exports.Comments = mongoose.model("Comments", commentSchema);
exports.Messages = mongoose.model("Messages", messageSchema);
