import firebase from 'firebase-admin';
import { Context, Next } from 'koa';
import { extractToken } from './utils';

const middleware = async (ctx: Context, next: Next) => {
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

export default middleware;
