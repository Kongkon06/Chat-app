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
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("./config");
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        console.log(users);
        res.json({ posts: users });
    }
    catch (e) {
        res.status(411).json({ msg: "Error while finding users: " + e });
    }
}));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    console.log(req.body);
    try {
        console.log("inside try");
        const token = jsonwebtoken_1.default.sign({ username }, config_1.JWT_SECRET);
        console.log("inside try");
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
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            res.json({ userId: user._id, username: user.username, token: token });
            return;
        }
    }
    catch (e) {
        res.status(500).json({ msg: "Username dosent exit" + e });
    }
}));
app.post('/post', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const content = req.body.content;
    const date = new Date;
    try {
        yield db_1.Posts.create({
            userId: userId,
            content: content,
            date: date
        });
        res.json({ msg: "Post sucessfully created" });
    }
    catch (e) {
        res.status(500).json({ msg: "Error while creating posts" });
    }
    return;
}));
app.post('/comment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
app.post('/follow', (req, res) => {
    const { userId } = req.body;
    if (db_1.Users.find({ userId: userId })) {
    }
});
app.post('/likes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, userId } = req.body;
    try {
        yield db_1.Posts.findOneUpdate({ postId: postId }, {
            $push: { like: userId }
        });
    }
    catch (e) {
        res.status(500).json({ msg: "Error while updating post" });
    }
}));
app.listen(3000, () => {
    console.log("Server is running");
});
module.exports = {
    app
};
