const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { insertOneDoc, getDocById } = require("../../db");
const bcrypt = require("bcrypt-nodejs");

passport.serializeUser((user, done) => {
  //console.log(user);
  done(null, { id: user.id });
});

passport.deserializeUser((user, done) => {
  
  done(null, getDocById(user.id,"login"));
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "correo",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const passwordss = bcrypt.hashSync(password);       
      const user = await insertOneDoc({ email, passwordss }, "login");      
      done(null, { email: user.ops[0].email, password: passwordss,_id:user.ops[0]._id });   
      
      
    },
  ),
);

