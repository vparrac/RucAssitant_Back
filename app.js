var express = require("express");
var port = process.env.port || 3000;
var indexRouter = require("./routes/index");
var botiquinRouter = require("./routes/botiquin.js");
var revisionRouter = require("./routes/revision");
var bodyParser = require("body-parser");

var { init } = require("./db");

var app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use("/", indexRouter);
app.use("/botiquin", botiquinRouter);
app.use("/revision", revisionRouter);

init().then(() => {
  app.listen(port, function() {});
});

module.exports = app;
