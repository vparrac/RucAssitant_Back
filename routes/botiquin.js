var express = require("express");
var router = express.Router();
const {
  getDocs,
  insertOneDoc,
  getDocById,
  updateDoc,
  getWithJoin,
} = require("../db");

router.get("/", (req, res) => {
  getDocs("botiquin").then(docs => {
    res.send(docs);
  });
});

router.get("/:id", (req, res) => {
  getDocById(req.params.id, "botiquin").then(doc => {
    res.send(doc);
  });
});

router.post("/crear", (req, res) => {
  const object = req.body;
  insertOneDoc(object, "botiquin").then(response => {
    res.send(response);
  });
});

router.put("/editar/:id", (req, res) => {
  const object = req.body;
  updateDoc(req.params.id, object, "botiquin").then(response => {
    res.send(response);
  });
});

router.get("/revisiones", (req, res) => {
  getWithJoin("botiquin", "revision", "revision_id", "_id", "revisiones").then(
    docs => {
      res.send(docs);
    },
  );
});

module.exports = router;
