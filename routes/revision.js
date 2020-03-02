const express = require("express");
const router = express.Router();
const { insertOneDoc, pushRevision, getDocById } = require("../db");
const {ObjectId } = require("mongodb");


router.post("/crearRevision", async (req, res) => {
  //console.log(req.body);
  const user = await req.user;
  
  const object = await req.body;
  
  const botiquin = await getDocById(object.botiquin,"botiquin");
  console.log(botiquin[0]);
  const revisionPendiente = { ...req.body, idGerente: user[0]._id, idUsuario: ObjectId(object.empleado), estado: "pendiente", nombreBotiquin:botiquin[0].nombre };
  
  const revision = await insertOneDoc(revisionPendiente, "revision");
  pushRevision(object.botiquin, revision.ops[0]._id);
  res.redirect("/botiquin");
});

//router.get("/listarRevisiones", (req,res)=>{} )



router.post("/:idBotiquin", (req, res) => {
  const botiquinId = req.params.idBotiquin;
  const object = req.body;
  insertOneDoc(object, "revision").then(response => {
    if (response.insertedCount == 1) {
      pushRevision(botiquinId, response.ops[0]._id).then(doc => {
        res.send(doc);
      });
    }
  });
});

module.exports = router;
