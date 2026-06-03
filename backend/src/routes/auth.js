import { Router } from 'express';
import passport from 'passport';
import { env } from '../config/env.js';
import { createJwtForUser } from '../services/googleAuth.js';

export const authRouter = Router();

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);

authRouter.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, async (error, user) => {
    try {
      if (error) {
        return next(error);
      }

      if (!user) {
        return res.redirect(`${env.frontendUrl}/?auth=failed`);
      }

      const token = createJwtForUser(user);
      const redirectUrl = new URL('/auth/callback', env.frontendUrl || 'http://localhost:3000');
      redirectUrl.searchParams.set('token', token);

      return res.redirect(redirectUrl.toString());
    } catch (callbackError) {
      return next(callbackError);
    }
  })(req, res, next);
});
