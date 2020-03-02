/**
 * Dependencia a express
 */
const express = require("express");
/**
 * Creación del router que nos permite agrupar este archivo en funcionalidades exportables
 */
const router = express.Router();

/**
 * Para homogeneizar el sistema de rutas
 */
const path = require("path");
/**
 * Dependencia de Passport
 */
const passport = require("passport");
/**
 * Para manejar los id de la base de datos
 */
const { ObjectId } = require("mongodb");
const {
  getGerenteByEmail,
  getLoginByName,
  insertEmpleadoOfGerente,
  insertOneDoc,
} = require("../db");

/**
 * Para encrytar la contraseñ
 */
const bcrypt = require("bcrypt-nodejs");
/**
 * Método para mostrar el formulario de registro
 */
router.get("/signup", (req, res) => {
  res.render(path.join(__dirname, "../public/views", "singup.ejs"));
});

/**
 * Método para que el navegador pueda acceder a la hoja de estilos del registro
 */
router.get("/authentication/css/style.css", function(req, res) {
  res.sendfile(path.join(__dirname, "../public/css", "style.css"));
});

/**
 * Método para que el navegador pueda acceder al script del registro
 */
router.get("/authentication.js", function(req, res) {
  res.sendfile(path.join(__dirname, "../public/js", "authentication.js"));
});

/**
 * Método para crear un empleado
 * Se requiere se un gerente para usar eso
 */
router.post("/crearEmpleado", isAuthenticateGerente,async (req, res) => {
  const userdb = await getLoginByName(req.correo);
  if (userdb.length >= 1) {
    req.flash("createEmpleado", "El correo ingresado ya está en uso."),
    res.redirect("/authentication/crearEmpleado");
  } else {
    const passwordss = bcrypt.hashSync(req.password);
    const gerente = await req.user;
    const nuevoUsuario = await req.body;
    await insertEmpleadoOfGerente({
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      idgerente: ObjectId(gerente[0]._id),
    });
    insertOneDoc(
      { email: nuevoUsuario.correo, passowrd: passwordss, role: "empleado" },
      "login",
    );
    res.redirect("/empleado/gerente/empleados");
  }
});

/**
 * Método con la petición para crear el registro del usuario
 */

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/authentication/signin",
    failureRedirect: "/authentication/signup",
    passReqToCallback: true,
  }),
);

/**
 * Método para inciar sesión
 */
router.post(
  "/signin",
  passport.authenticate("local-signin", {
    successRedirect: "/",
    failureRedirect: "/authentication/signin",
    passReqToCallback: true,
  }),
);
/**
 * Mètodo para obtener el formularo de login
 */
router.get("/signin", (req, res) => {
  res.render(path.join(__dirname, "../public/views", "singin.ejs"));
});

/**
 * Método para deslogear la sesión
 */
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

/**
 * Método para usar la autenticación
 */
router.use((req, res, next) => {
  isAuthenticateGerente(req, res, next);
});

/**
 * Método para ir al pérfil -- Se necesita ser gerente
 */
router.get("/profile", isAuthenticateGerente, (req, res) => {
  res.render("postBotiquin");
});


/**
 *  Método que validad que este autenticado y que es un gerente
 * @param {*} req request del usuario
 * @param {*} res  res para enviar la respuesta
 * @param {*} next Para que el programa continue su cuarso
 */
async function isAuthenticateGerente(req, res, next) {
  const user = await req.user;

  if (user) {
    const gerente = await getGerenteByEmail(user[0].email);

    if (req.isAuthenticated() && gerente.length >= 1) return next();
    else {
      req.flash("signinMessage", "Credenciales no validas"),
      res.redirect("/authentication/signin");
      return;
    }
  } else {
    req.flash("signinMessage", "Credenciales no validas"),
    res.redirect("/authentication/signin");
    return;
  }
}

//async function isAuthenticateEmpleado(req, res, next) {
//  const user = await req.user;
//  const empleado = await getDocById(user[0].id,"empleados");
//  if (req.isAuthenticated()&&empleado.length>=1) return next();
//  req.flash("signinMessage", "Credenciales no validas"),
//  res.redirect("/authentication/signin");
//}

module.exports = router;
