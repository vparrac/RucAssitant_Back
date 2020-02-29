const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { insertOneDoc} = require("../../db");


passport.serializeUser((user,done)=>{
  
  done(null, {id: user.id});
});

passport.deserializeUser((id,done)=>{
  
  done(null, {id:id});
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
      const user = await insertOneDoc({email,password},"login");      
      done(null,{ email:user.ops[0].email, password: user.ops[0].password});
    }
  )
);
