let express = require("express");
let router = express.Router();
const { insertOneDoc, pushRevision } = require("../db");

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
