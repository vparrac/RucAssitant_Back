let express = require("express");
let router = express.Router();
const { ObjectId } = require("mongodb");
const { getEmpleadoOfGerente, deleteEmpleado, getGerenteByEmail } = require("../db");



/**
 * Método para borrar un empleado. Es necesario ser un gerente
 */

router.post("/borrar/", isAuthenticateGerente,async (req, res) => {
  const object = await req.body;
  
  deleteEmpleado({ _id: ObjectId(object._id) });
  res.redirect("/empleado/gerente/empleados");
});

/**
 * Crea un empleado y lo asocia a un empleado
 */
router.get("/gerente/crearEmpleado", isAuthenticateGerente, async (req, res) => {
  res.render("creacionEmpleados");
});

/**
 * Retorna los empleados de un gerente
 */

router.get("/gerente/empleados", isAuthenticateGerente, async (req, res) => {
  const gerente = await req.user;
  const empleados = await getEmpleadoOfGerente(gerente[0]._id);
  res.render("empleados", { empleados: empleados });
});

/**
 * Métpdp que permite validar si un gerente está autenticado
 * @param {*} req  El request del usuario
 * @param {*} res Para enviar respuesa al usuario
 * @param {*} next Para que el programa siga su curso
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

module.exports = router;
