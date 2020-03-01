<<<<<<< HEAD
let express = require("express");
let port = process.env.port || 3000;
let indexRouter = require("./routes/index");
let botiquinRouter = require("./routes/botiquin.js");
let revisionRouter = require("./routes/revision");
let bodyParser = require("body-parser");

let { init } = require("./db");

let app = express();
=======
const express = require("express");
const morgan = require("morgan");

/**
 * Variable que contendrá el puerto donde se deplegará la aplicación
 * Para evitar confliictos con Heroku u otras aplicaciones de despliegue
 * Primero se valida la existencia de la constante global sino se va al puerto 3000
 */
const port = process.env.PORT || 3000;
const indexRouter = require("./routes/index");
const botiquinRouter = require("./routes/botiquin.js");
const revisionRouter = require("./routes/revision");
const bodyParser = require("body-parser");
const authenticationRouter = require("./routes/authentication");
const empleadoRouter = require("./routes/empleado");
const gerenteRouter = require("./routes/gerente");

const { init } = require("./db");

const app = express();

//Middlewares
app.use(morgan("dev"));
>>>>>>> 63f810123339c1b03bce18be59c43fb4d5a7c321

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
app.use("/authentication", authenticationRouter);
app.use("/empleado", empleadoRouter);
app.use("/gerente", gerenteRouter);

init().then(() => {
  app.listen(port, function() {});
});

module.exports = app;
