const express = require("express");
const router = express.Router();
const path = require("path");


router.get("/singup", (req, res) => {
  res.sendfile((path.join(__dirname,"../public/templates","singup.html")));
});
//router.post("/singup", (req, res, next) => {});
//router.get("/singin", (req, res) => {
//  res.send("Hello World!");
//});
//router.post("/singin", (req, res, next) => {});

router.get("/authentication/css/style.css", function(req, res) {
  res.sendfile((path.join(__dirname,"../public/css","style.css")));
});

router.get("/authentication.js", function(req, res) {
  res.sendfile((path.join(__dirname,"../public/js","authentication.js")));
});

module.exports = router;
