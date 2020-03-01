const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { insertOneDoc, getDocById, getLoginByName, getLoginByEmail } = require("../../db");
const bcrypt = require("bcrypt-nodejs");

passport.serializeUser((user, done) => {
  //console.log("s");
  console.log(user[0]._id);
  done(null, { id: user[0]._id });
});

passport.deserializeUser((user, done) => {
  //console.log("usuario");
  //console.log(user);
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
        //console.log(req);
        return done(
          null,
          false,
          req.flash("signupMessage", "El correo ingresado ya está en uso."),
        );
      } else {
        //console.log(req.body);
        const passwordss = bcrypt.hashSync(password);
        const nombreEmpresa = req.body.nombreEmpresa;
        const contacto = req.body.contacto;
        const gerente = await insertOneDoc(
          { email, nombreEmpresa, contacto },
          "gerentes",
        );
          
        if (gerente) {
          const user = await insertOneDoc({ email, passwordss }, "login");          
          done(null, [
            {
              email: user.ops[0].email,
              password: passwordss,
              _id: user.ops[0]._id,
            },
          ]);
        }
        else{
          return done(
            null,
            false,
            req.flash("signupMessage", "Hubo un error insertando el registro"),
          );
        }
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
        //console.log("email no encontrado");
        //console.log(req);
        return done(
          null,
          false,
          req.flash("signinMessage", "Usuario no encontrado "),
        );
        
      } else if (!bcrypt.hashSync(password) == userdb.password) {
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


passport.use(
  "empleado-signup",
  new LocalStrategy(
    {
      usernameField: "correo",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userdb = await getLoginByEmail(email);
      if (userdb.length >= 1) {
        //console.log(req);
        return done(
          null,
          false,
          req.flash("signupMessage", "El correo ingresado ya está en uso."),
        );
      } else {
        //console.log(req.body);
        const passwordss = bcrypt.hashSync(password);
        const nombreEmpresa = req.body.nombreEmpresa;
        const nombre = req.body.nombre;
        const gerenteId = req.body.gerenteid;
        const empleado = await insertOneDoc(
          { email, nombreEmpresa, nombre, gerenteId },
          "gerentes",
        );

        if (empleado.length>=1) {
          const user = await insertOneDoc({ email, passwordss }, "login");
          done(null, [
            {
              email: user.ops[0].email,
              password: passwordss,
              _id: user.ops[0]._id,
            },
          ]);
        }
        else{
          return done(
            null,
            false,
            req.flash("signupMessage", "Hubo un error insertando el registro"),
          );
        }
      }
    },
  ),
);
