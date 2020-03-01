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

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use("/", indexRouter);
app.use("/botiquin", botiquinRouter);
app.use("/revision", revisionRouter);
app.use("/authentication", authenticationRouter);
app.use("/  ", empleadoRouter);
app.use("/gerente", gerenteRouter);

init().then(() => {
  app.listen(port, function() {});
});

module.exports = app;
