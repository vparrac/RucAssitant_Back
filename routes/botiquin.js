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
  getBotiquinesByGerente, getEmpleadoOfGerente, findRevisionesByEmpleado,getBotiquinesGerente } = require("../db");
const {
  pushRegistroExt,
  updateElementosBotiquin,
  getRegistrosByBotiquinYGerente
} = require("../db");
const { insertOneDoc, getDocById, updateDoc } = require("../db");
const moment = require("moment");

router.get("/", isAuthenticateGerente, async (req, res) => {
  const user = await req.user;  
  getBotiquinesGerente(user[0]._id).then(docs => {
    res.render("getBotiquin.ejs", { botiquines: docs });
  });
}); 

router.get("/getExt", isAuthenticateGerente, async (req, res) => {
  const gerente = await req.user;
  getBotiquinesByGerente(gerente[0]._id).then(docs => {
    res.render("verRegistros.ejs", { botiquines: docs });
  });
});

/**
 * Método que crea una revisión a partir de la asignación de un jefe
 */
router.get("/asignacionPorMes", isAuthenticateGerente, async (req, res) => {
  const gerente = await req.user;
  getBotiquinesByGerente(gerente[0]._id).then(docs => {
    getEmpleadoOfGerente(gerente[0]._id).then(empleados => {
      res.render("asignacionPorMes.ejs", {
        empleados: empleados,
        botiquines: docs,
      });
    });
  });
});

router.get("/botiquinesExt", async (req, res) => {
  const empleado = await req.user;
  getEmpleadoByEmail(empleado[0].email).then(nuevoEmpleado => {
    getBotiquinesByGerente(nuevoEmpleado[0].idgerente).then(botiquines => {
      res.render("extraordinarioBotiquin", { botiquines: botiquines });
    });
  });
  /*
  res.render("extraordinarioBotiquin", {botiquines: {_id:1, nombre: "1"}});
  consolelog(idgerente);
  */
});

router.get("/dibujarBotiquin", isAuthenticateGerente, async (req, res) => {
  const gerente = await req.user;
  getBotiquinesByGerente(gerente[0]._id).then(docs => {
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

  const object = { ...req.body, idgerente: gerente[0]._id, revision_id: [] };

  insertOneDoc(object, "botiquin").then(response => {
    if (response.insertedCount === 1) {
      getBotiquinesByGerente(gerente[0]._id).then(() => {
        res.redirect("/botiquin")
      });
    } else {
      res.send(response);
    }
  });
});


router.get("/obtenerUsos/:id", isAuthenticateGerente, async (req,res) => 
{
  const gerente = await req.user;
  getRegistrosByBotiquinYGerente(req.params.id, gerente[0]._id).then((docs) => {
    res.json(docs);
  });
});

router.put("/editar/:id", isAuthenticateGerente, async (req, res) => {
  const object = req.body;
  const gerente = await req.user;
  object.idgerente = gerente[0]._id;
  updateDoc(req.params.id, object, "botiquin").then(response => {
    res.send(response);
  });
});

/*laupardo: Si los atributos de obj y botiquin son iguales podrían considerar hacer esto de 
manera iterativa o igualar obj a botiquin[0] y ahorrarse unas líneas de código.
*/
router.post("/registrarExt", async (req, res) => {
  getDocById(req.body.botiquin, "botiquin").then(botiquin => {
    
    const obj = botiquin[0];
    if (req.body.gasas >= obj.gasas) {
      obj.gasas = 0;
    } else {
      obj.gasas -= req.body.gasas;
    }
    if (req.body.esparadrapo4Metros >= obj.esparadrapo4Metros) {
      obj.esparadrapo4Metros = 0;
    } else {
      obj.esparadrapo4Metros -= req.body.esparadrapo4Metros;
    }
    if (req.body.bajaLenguas >= obj.bajaLenguas) {
      obj.bajaLenguas = 0;
    } else {
      obj.bajaLenguas -= req.body.bajaLenguas;
    }
    if (req.body.guantesLatex >= obj.guantesLatex) {
      botiquin.guantesLatex = 0;
    } else {
      obj.guantesLatex -= req.body.guantesLatex;
    }
    if (req.body.vendaEl2x5 >= obj.vendaEl2x5) {
      obj.vendaEl2x5 = 0;
    } else {
      obj.vendaEl2x5 -= req.body.vendaEl2x5;
    }
    if (req.body.vendaEl3x5 >= obj.vendaEl2x5) {
      obj.vendaEl3x5 = 0;
    } else {
      obj.vendaEl3x5 -= req.body.vendaEl3x5;
    }
    if (req.body.vendaEl5x5 >= obj.vendaEl5x5) {
      obj.vendaEl5x5 = 0;
    } else {
      obj.vendaEl5x5 -= req.body.vendaEl5x5;
    }
    if (req.body.vendaAl3x5 >= obj.vendaAl3x5) {
      obj.vendaAl3x5 = 0;
    } else {
      obj.vendaAl3x5 -= req.body.vendaAl3x5;
    }
    if (req.body.yodopovidona120 >= obj.yodopovidona120) {
      obj.yodopovidona120 = 0;
    } else {
      obj.yodopovidona120 -= req.body.yodopovidona120;
    }
    if (req.body.solucionSal >= obj.solucionSal) {
      obj.solucionSal = 0;
    } else {
      obj.solucionSal -= req.body.solucionSal;
    }
    if (req.body.termometro >= obj.termometro) {
      obj.termometro = 0;
    } else {
      obj.termometro -= req.body.termometro;
    }
    if (req.body.alcohol >= obj.alcohol) {
      obj.alcohol = 0;
    } else {
      obj.alcohol -= req.body.alcohol;
    }
    obj.date = moment().month();
    obj.idgerente = botiquin[0].idgerente;
    obj.idbotiquin = botiquin[0]._id;
    insertOneDoc(obj, "registroExt").then(doc => {
      pushRegistroExt(botiquin[0]._id, doc.ops[0]._id).then(() => {
        updateElementosBotiquin(
          botiquin[0]._id,
          obj.gasas,
          obj.esparadrapo4Metros,
          obj.bajaLenguas,
          obj.guantesLatex,
          obj.vendaEl2x5,
          obj.vendaEl3x5,
          obj.vendaEl3x5,
          obj.vendaAl3x5,
          obj.yodopovidona120,
          obj.solucionSal,
          obj.termometro,
          obj.alcohol,
        ).then(() => {
          res.redirect("/");
        });
      });
    });
  });
});

/**
 * Método que muestras la revisiones pendientes de un usuario
 */

router.get(
  "/revisionesPendientes",
  isAuthenticateEmpleado,
  async (req, res) => {
    const user = await req.user;

    const empleado = await getEmpleadoByEmail(user[0].email);

    const revisiones = await findRevisionesByEmpleado(empleado[0]._id);

    res.render("revisionesPendientes", { revisiones: revisiones });
  },
);

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
