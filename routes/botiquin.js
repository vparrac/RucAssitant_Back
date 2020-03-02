/**
 * Dependencia a express
 */
const express = require("express");
/**
 * Método para manejar REST
 */
const router = express.Router();
/**
 * Métodos para la consulta de la base de datos
 */
const { getGerenteByEmail, getEmpleadoByEmail, 
  getBotiquinesByGerente, getEmpleadoOfGerente, findRevisionesByEmpleado } = require("../db");
const {
  getDocs,
  insertOneDoc,
  getDocById,
  updateDoc,  
  
} = require("../db");

router.get("/", isAuthenticateGerente, (req, res) => {
  getDocs("botiquin").then(docs => {
    res.render("getBotiquin.ejs", { botiquines: docs });
  });
});


router.get("/dibujarBotiquin", isAuthenticateGerente, (req, res) => {
  //console.log("dibujar");
  getDocs("botiquin").then(docs => {
    res.json(docs);
  });
});

router.get("/botiquin/:id", isAuthenticateGerente, (req, res) => {
  getDocById(req.params.id, "botiquin").then(doc => {
    res.json(doc);
  });
});

router.get("/postPage", isAuthenticateGerente, (req, res) => {
  res.render("postBotiquin.ejs");
});

router.post("/crear", isAuthenticateGerente, async (req, res) => {
  const gerente = await req.user;

  const object = { ...req.body, idgerente: gerente[0]._id, revision_id:[] };

  insertOneDoc(object, "botiquin").then(response => {
    if (response.insertedCount === 1) {
      getBotiquinesByGerente(gerente[0]._id).then(docs => {
        res.render("getBotiquin.ejs", { botiquines: docs });
      });
    } else {
      res.send(response);
    }
  });
});


/**
 * Método que crea una revisión a partir de la asignación de un jefe
 */
router.get("/asignacionPorMes", isAuthenticateGerente, async (req, res) => {
  const gerente = await req.user;
  getBotiquinesByGerente(gerente[0]._id).then(docs => {
    getEmpleadoOfGerente(gerente[0]._id).then(
      (empleados)=>{
        res.render("asignacionPorMes.ejs",  { empleados: empleados, botiquines: docs });
      }
    );       
    
  });
});

router.put("/editar/:id", isAuthenticateGerente, (req, res) => {
  const object = req.body;

  updateDoc(req.params.id, object, "botiquin").then(response => {
    res.send(response);
  });
});


/**
 * Método que muestras la revisiones pendientes de un usuario
 */

router.get("/revisionesPendientes", isAuthenticateEmpleado, async (req, res) => {
  const user = await req.user;
  
  const empleado = await getEmpleadoByEmail(user[0].email);
  
  const revisiones = await  findRevisionesByEmpleado(empleado[0]._id);
  
  res.render("revisionesPendientes",{revisiones:revisiones});
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
    // console.log(gerente);
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


async function isAuthenticateEmpleado(req, res, next) {
  const user = await req.user;

  if (user) {
    const empleado = await getEmpleadoByEmail(user[0].email);
    
    if (req.isAuthenticated() && empleado.length >= 1) return next();
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
