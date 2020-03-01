var express = require("express");
var router = express.Router();
const { getDocs, insertOneDoc, getDocById, updateDoc, pushEmpleado } = require("../db");

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

router.post("/:idGerente", (req, res) => {
  const gerenteId = req.params.idGerente;
  const object = req.body;
  insertOneDoc(object, "empleados").then(response => {
    console.log(object);
    if (response.insertedCount == 1) {
      pushEmpleado(gerenteId, response.ops[0]._id).then(doc => {
        res.send(doc);
      });
    }
  });
});

module.exports = router;
