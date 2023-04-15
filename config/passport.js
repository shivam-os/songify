const User = require("../config/db").user;
const cookieExtractor = require("../utils/cookieToken");
require("dotenv").config();

//Import Strategy class from passport-jwt
const JwtStrategy = require("passport-jwt").Strategy;

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async function (jwt_payload, done) {
      try {
        //Check if user with userId exists in the database
        const existingUser = await User.findOne({
          where: { userId: jwt_payload.userId },
          attributes: ["userId"]
        });

        //If it exists, then send the userId else return false
        if (existingUser) {
          return done(null, existingUser);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(null, false);
      }
    })
  );
};
