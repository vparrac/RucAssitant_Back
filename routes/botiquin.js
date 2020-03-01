let express = require("express");
let router = express.Router();

const {
  getDocs,
  insertOneDoc,
  getDocById,
  updateDoc,
  getWithJoin,
} = require("../db");

router.get("/", isAuthenticateGerente,(req, res) => {
  getDocs("botiquin").then(docs => {
    res.render("postBotiquin.ejs", { botiquines: docs });
  });
});

router.get("/dibujarBotiquin", isAuthenticateGerente,(req, res) => {
  getDocs("botiquin").then(docs => {
    res.json(docs);
  });
});

router.get("/botiquin/:id",isAuthenticateGerente, (req, res) => {
  getDocById(req.params.id, "botiquin").then(doc => {
    res.json(doc);
  });
});

router.get("/postPage", isAuthenticateGerente, (req, res) => {
  res.render("postBotiquin.ejs");
});

router.post("/crear", isAuthenticateGerente, (req, res) => {
  const object = req.body;
  insertOneDoc(object, "botiquin").then(response => {
    if (response.insertedCount === 1) {
      getDocs("botiquin").then(docs => {
        res.render("getBotiquin.ejs", { botiquines: docs });
      });
    } else {
      res.send(response);
    }
  });
});

router.get("/asignacionPorMes", isAuthenticateGerente,(req, res) => {
  getDocs("botiquin").then(docs => {
    res.render("asignacionPorMes.ejs", { botiquines: docs });
  });
});

router.put("/editar/:id", isAuthenticateGerente,(req, res) => {
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
    const gerente = await getDocById(user[0].id, "gerentes");
    if (req.isAuthenticated() && gerente.length >= 1) return next();    
  }
  else{
    req.flash("signinMessage", "Ingrese sus credenciales para acceder al recurso solicitado"),
    res.redirect("/authentication/signin");
  }
}

module.exports = router;
