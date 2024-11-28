import { JWT_SECRET } from './config'
import { Request, Response, NextFunction } from 'express';
const jwt = require("jsonwebtoken");
export function middleware(req: Request, res: Response, next: NextFunction) {
  const body = req.headers.authorisation;
  const pass = jwt.verify(JWT_SECRET, body);
  if (!pass) {
    res.json({ msg: "you are not authorised" })
    return
  }
  next();
}
