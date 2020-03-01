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
  getDocs("gerentes").then(docs => {
    res.send(docs);
  });
});

router.get("/gerente/:id", (req, res) => {
  getDocById(req.params.id, "gerentes").then(doc => {
    res.send(doc);
  });
});

router.post("/create", (req, res) => {
  const object = req.body;
  insertOneDoc(object, "gerentes").then(response => {
    res.send(response);
  });
});

router.put("/editar/:id", (req, res) => {
  const object = req.body;
  updateDoc(req.params.id, object, "gerentes").then(response => {
    res.send(response);
  });
});

router.get("/empleadosGerente/", (req, res) => {
  getWithJoin("gerentes", "empleados", "empleados_id", "_id", "empleado").then(
    docs => {
      res.send(docs);
    },
  );
});

module.exports = router;
