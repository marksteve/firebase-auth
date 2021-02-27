import { RequestHandler } from 'express';
import firebase from 'firebase-admin';
import { Context, Next } from 'koa';

firebase.initializeApp();

function extractToken(authHeader: string) {
  const match = authHeader.match(/bearer\s+(.+)/i);
  if (!match) {
    throw new Error('Invalid authorization header');
  }
  return match[1];
}

declare global {
  namespace Express {
    export interface Request {
      uid?: string;
    }
  }
}

const express: RequestHandler = async (req, res, next) => {
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

const koa = async (ctx: Context, next: Next) => {
  const authHeader = ctx.request.headers.authorization;
  if (authHeader) {
    const token = extractToken(authHeader);
    try {
      const decodedToken = await firebase.auth().verifyIdToken(token);
      ctx.state.uid = decodedToken.uid;
      await next();
    } catch (err) {
      err.status = 403;
      throw err;
    }
  } else {
    ctx.status = 401;
  }
};

export default {
  express,
  koa,
};
