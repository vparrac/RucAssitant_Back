let express = require("express");
let router = express.Router();
const { ObjectId } = require("mongodb");
const { getEmpleadoOfGerente, deleteEmpleado, getGerenteByEmail } = require("../db");

const {
  getDocs,  
  getDocById,
  updateDoc,
} = require("../db");

router.get("/", (req, res) => {
  getDocs("empleados").then(docs => {
    res.send(docs);
  });
});

router.get("/empleado/:id", (req, res) => {
  getDocById(req.params.id, "empleados").then(doc => {
    res.send(doc);
  });
});

router.put("/empleado/:id", (req, res) => {
  const object = req.body;
  updateDoc(req.params.id, object, "empleados").then(response => {
    res.send(response);
  });
});

router.post("/borrar/", isAuthenticateGerente,async (req, res) => {
  const object = await req.body;
  console.log(object._id);
  deleteEmpleado({ _id: ObjectId(object._id) });
  res.redirect("/empleado/gerente/empleados");
});

//router.post("/gerente/:idGerente", async (req, res) => {
//  const gerenteId = await req.params.idGerente;
//  const object = req.body;
//  insertOneDoc(object, "empleados").then(response => {
//    if (response.insertedCount == 1) {
//      pushEmpleado(gerenteId, response.ops[0]._id).then(doc => {
//        res.send(doc);
//      });
//    }
//  });
//});


router.get("/gerente/crearEmpleado", isAuthenticateGerente, async (req, res) => {
  res.render("creacionEmpleados");
});


router.get("/gerente/empleados", isAuthenticateGerente, async (req, res) => {
  const gerente = await req.user;
  const empleados = await getEmpleadoOfGerente(gerente[0]._id);
  res.render("empleados", { empleados: empleados });
});


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

module.exports = router;
