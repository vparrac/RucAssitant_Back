const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { insertOneDoc, getDocById, getLoginByName } = require("../../db");
const bcrypt = require("bcrypt-nodejs");

passport.serializeUser((user, done) => {
  //console.log(user);
  done(null, { id: user.id });
});

passport.deserializeUser((user, done) => {
  done(null, getDocById(user.id, "login"));
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
      const userdb = await getLoginByName(email);
      if (userdb.length >= 1) {
        console.log(req);
        return done(
          null,
          false,
          req.flash("signupMessage", "El correo ingresado ya está en uso."),
        );
      } else {
        const passwordss = bcrypt.hashSync(password);
        const user = await insertOneDoc({ email, passwordss }, "login");
        done(null, {
          email: user.ops[0].email,
          password: passwordss,
          _id: user.ops[0]._id,
        });
      }
    },
  ),
);

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "correo",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userdb = await getLoginByName(email);
      console.log(userdb);
      if (userdb.length < 1) {
        console.log("email no encontrado");
        //console.log(req);
        return done(
          null,
          false,
          req.flash("signinMessage", "Usuario no encontrado "),
        );
      } else if (!(bcrypt.hashSync(password) === userdb.password)) {
        console.log("contraseña incorrecta");
        return done(
          null,
          false,
          req.flash("signinMessage", "Contraseña incorrecta"),
        );
      }
      done(null, userdb);
    },
  ),
);
