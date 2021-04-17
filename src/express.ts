import { RequestHandler } from 'express';
import firebase from 'firebase-admin';
import { extractToken } from './utils';

declare global {
  namespace Express {
    export interface Request {
      uid?: string;
    }
  }
}

const middleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = extractToken(authHeader);
    try {
      const decodedToken = await firebase.auth().verifyIdToken(token);
      req.uid = decodedToken.uid;
      next();
    } catch (err) {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};

export default middleware;
