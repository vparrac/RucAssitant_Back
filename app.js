let express = require("express");
let port = process.env.port || 3000;
let indexRouter = require("./routes/index");
let botiquinRouter = require("./routes/botiquin.js");
let revisionRouter = require("./routes/revision");
let bodyParser = require("body-parser");

let { init } = require("./db");

let app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(express.static("public"));
app.use("/", indexRouter);
app.use("/botiquin", botiquinRouter);
app.use("/revision", revisionRouter);

init().then(() => {
  app.listen(port, function() {});
});

module.exports = app;
