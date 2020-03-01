let express = require("express");
let router = express.Router();
const {
  getDocs,
  insertOneDoc,
  getDocById,
  updateDoc,
  getWithJoin,
} = require("../db");

router.get("/", (req, res) => {
  getDocs("botiquin").then(docs => {
    res.render("postBotiquin.ejs", { botiquines: docs });
  });
});

router.get("/dibujarBotiquin", (req, res) => {
  getDocs("botiquin").then(docs => {
    res.json(docs);
  });
});

router.get("/botiquin/:id", (req, res) => {
  getDocById(req.params.id, "botiquin").then(doc => {
    res.json(doc);
  });
});

router.get("/postPage", (req, res) => {
  res.render("postBotiquin.ejs");
});

router.post("/crear", (req, res) => {
  const object = req.body;
  insertOneDoc(object, "botiquin").then(response => {
    if (response.insertedCount === 1) {
      getDocs("botiquin").then(docs => {
        res.render("../public/views/getBotiquin.ejs", { botiquines: docs });
      });
    } else {
      res.send(response);
    }
  });
});

router.get("/asignacionPorMes", (req, res) => {
  getDocs("botiquin").then(docs => {
    res.render("asignacionPorMes.ejs", { botiquines: docs });
  });
});

router.put("/editar/:id", (req, res) => {
  const object = req.body;
  console.log(object);
  updateDoc(req.params.id, object, "botiquin").then(response => {
    res.send(response);
  });
});

router.get("/revisionesDeBotiquin/:id", (req, res) => {
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

module.exports = router;
