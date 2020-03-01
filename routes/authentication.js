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

const passport = require("passport");
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
 * Método con la petición para crear el registro del usuario
 */

router.post("/signup", passport.authenticate("local-signup",{
  successRedirect: "/authentication/signin",
  failureRedirect: "/authentication/signup",
  passReqToCallback: true
})
);

router.post("/signin", passport.authenticate("local-signin",{
  successRedirect: "/authentication/profile",
  failureRedirect: "/authentication/signin",
  passReqToCallback: true
})
);

router.get("/profile", (req, res) => {
  
  res.send("in");
});

/**
 * Mètodo para obtener el formularo de login
 */
router.get("/signin", (req, res) => {
  res.render(path.join(__dirname, "../public/views", "singin.ejs"));
});

module.exports = router;
