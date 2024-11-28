"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = __importDefault(require("./Post/post"));
const User_1 = __importDefault(require("./User/User"));
const cors_1 = __importDefault(require("cors"));
const App = (0, express_1.default)();
App.use(express_1.default.json());
App.use((0, cors_1.default)());
App.use('/api/v1/user', User_1.default);
App.use('/api/v1/post', post_1.default);
App.listen(3000, () => {
    console.log("Server is running");
});
