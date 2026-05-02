import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import User from '../models/User.js';

export const initializePassport = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email: string, password: string, done: Function) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'No user found' });
          }

          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done: Function) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done: Function) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default passport;
