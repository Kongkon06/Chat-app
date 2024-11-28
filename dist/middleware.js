"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = middleware;
const config_1 = require("./config");
const jwt = require("jsonwebtoken");
function middleware(req, res, next) {
    const body = req.headers.authorisation;
    const pass = jwt.verify(config_1.JWT_SECRET, body);
    if (!pass) {
        res.json({ msg: "you are not authorised" });
        return;
    }
    next();
}
