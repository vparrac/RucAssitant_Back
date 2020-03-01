let express = require("express");
let router = express.Router();

router.get("/", (req, res) => {
  res.render("../public/views/index.ejs");
});

module.exports = router;
