import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';
import { syncGoogleUser } from '../services/googleAuth.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: env.googleCallbackUrl,
      passReqToCallback: false,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await syncGoogleUser(profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export { passport };
