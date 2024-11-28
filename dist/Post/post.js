"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const Post = express_1.default.Router();
Post.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.Posts.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            }
        ]);
        res.json({ posts: users });
    }
    catch (e) {
        res.status(411).json({ msg: "Error while finding users: " + e });
    }
}));
Post.post('/userpost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    try {
        const data = yield db_1.Posts.findMany({ userId: userId });
        res.json({ userpost: data });
        return;
    }
    catch (e) {
        res.status(500).json({
            msg: "error while searching post"
        });
    }
}));
Post.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = req.body.content;
    const userId = req.body.userId;
    const date = new Date;
    try {
        yield db_1.Posts.create({
            userId: userId,
            content: content,
            date: date
        });
        res.json({
            msg: "post created sucessfully"
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error while creating post " + e
        });
    }
}));
Post.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.body.postId;
    try {
        yield db_1.Posts.delete({
            _id: postId
        });
        res.json({
            msg: "Post deleted"
        });
    }
    catch (e) {
        res.json({
            msg: "error while deleting posts " + e
        });
    }
    res.json();
}));
Post.put('/edit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.body.postId;
    const content = req.body.content;
    try {
        yield db_1.Posts.updateOne({
            _id: postId
        }, {
            content: content
        });
        res.json({ msg: "post updated sucessfully" });
    }
    catch (e) {
        res.status(500).json({
            msg: "error while updating post" + e
        });
    }
}));
Post.put('/comment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, content } = req.body;
    try {
        yield db_1.Comments.create({
            postId: postId,
            content: content
        });
        res.json({ msg: "Comment created" });
    }
    catch (e) {
        res.status(500).json({ msg: "error while creating commnet" });
    }
    res.json();
}));
Post.put('/likes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const postId = req.body.psotId;
    try {
        const update = yield db_1.Posts.updateOne({ _id: postId }, { $push: { likes: userId } });
        res.json({
            msg: "Done"
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "error while updateing likes " + e
        });
    }
}));
exports.default = Post;
