const express = require("express");
const router = express.Router();
const { getGerenteByEmail, getBotiquinesByGerente } = require("../db");
const {
  getDocs,
  insertOneDoc,
  getDocById,
  updateDoc,
  getWithJoin,
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
  
  
  const object = { ...req.body, idgerente: gerente[0]._id };

  
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

router.get("/asignacionPorMes", isAuthenticateGerente, async (req, res) => {
  const gerente = await req.user;
  getBotiquinesByGerente(gerente[0]._id).then(docs => {
    res.render("asignacionPorMes.ejs", { botiquines: docs });
  });
});

router.put("/editar/:id", isAuthenticateGerente, (req, res) => {
  const object = req.body;

  updateDoc(req.params.id, object, "botiquin").then(response => {
    res.send(response);
  });
});

router.get("/revisionesDeBotiquin/:id", isAuthenticateGerente, (req, res) => {
  getWithJoin(
    "botiquin",
    "revision",
    "revision_id",
    "_id",
    "revisiones",
    req.params.id,
  ).then(docs => {
    res.send(docs);
  });
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
