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
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db");
const { ObjectId } = require("mongoose").Types;
const { Types } = require("mongoose");
const User = express_1.default.Router();
User.post('/userInfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    try {
        const user = yield db_1.Users.aggregate([
            {
                $match: { username: username }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'posts'
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
        if (user) {
            res.json({ data: user });
        }
        else {
            res.status(500).json({ msg: "user doesnt exist" });
        }
    }
    catch (e) {
        res.status(411).json({
            msg: "user dosent exist" + e
        });
    }
}));
User.post('/Checkmessages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    try {
        const Messageobject = yield db_1.Messages.findOne({
            $or: [
                { "connection.user1": userId },
                { "connection.user2": userId }
            ],
        });
        res.json({ msg: Messageobject });
    }
    catch (e) {
        res.status(500).json({
            msg: "error while acessing past messages"
        });
    }
}));
User.post('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        res.json({ msg: "give userid" });
        return;
    }
    const Messageobject = yield db_1.Messages.find({
        connection: { $in: [userId] },
    });
    res.json({ msg: Messageobject });
}));
User.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    console.log(req.body);
    try {
        const token = jsonwebtoken_1.default.sign({ username }, config_1.JWT_SECRET);
        const hashedpassword = yield bcrypt_1.default.hash(password, 10);
        yield db_1.Users.create({
            name: name,
            username: username,
            email: email,
            password: hashedpassword
        });
        res.json({ msg: "User created successfully", token: token });
        return;
    }
    catch (e) {
        console.error("Error creating user:", e); // Log the error
        res.status(500).json({ msg: "Error creating user" }); // Remove JWT from error response
    }
    return;
}));
User.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = yield db_1.Users.findOne({ username: username });
        if (user) {
            console.log(user.password + " " + password);
            const reslt = yield bcrypt_1.default.compare(password, user.password);
            if (!reslt) {
                res.status(411).json({ msg: "password error" + reslt });
                return;
            }
            const token = jsonwebtoken_1.default.sign(config_1.JWT_SECRET, user.username);
            res.json({ userId: user._id, username: user.username, followed: user.followed, follwer: user.followers, token: token });
            return;
        }
    }
    catch (e) {
        res.status(500).json({ msg: "Username dosent exit" + e });
    }
}));
User.put('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const username = req.body.username;
    const bio = req.body.bio;
    try {
        yield db_1.Users.updateOne({
            _id: userId
        }, {
            username: username,
            Bio: bio
        });
    }
    catch (e) {
    }
    res.json({});
}));
User.put('/credentials', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const email = req.body.email;
    const password = req.body.bio;
    try {
        yield db_1.Users.updateOne({
            _id: userId
        }, {
            email: email,
            password: password
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "error while updating credentials"
        });
    }
    res.json({});
}));
User.put('/follow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const userId = req.body.userId;
    const followerId = req.body.followerId;
    try {
        yield db_1.Users.updateOne({ _id: userId }, {
            $push: { followers: followerId }
        });
        res.json({
            msg: "follower added"
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "error while adding follower " + e
        });
    }
}));
User.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    try {
        const user = yield db_1.Users.delete({
            _id: userId
        });
        res.json({ msg: "User deleted sucessfully" });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error while deleting user " + e
        });
    }
    res.json({});
}));
exports.default = User;
