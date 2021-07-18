const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const log = require("./utils/logger");
const config = require("./config");
const errorHandler = require("./api/libs/errorHandler");
const authJWT = require("./api/libs/auth");
const userController = require("./api/recursos/user/user.controller");
const userRouter = require("./api/recursos/user/user.routes");
const journeyRouter = require("./api/recursos/journey/journey.routes");
const leagueRouter = require("./api/recursos/league/league.routes");
const teamRouter = require("./api/recursos/team/team.router");
const soccerGameRouter = require("./api/recursos/soccerGame/soccerGame.routes");
const reportRouter = require("./api/recursos/report/report.routes");

passport.use(authJWT);

mongoose.connect("mongodb://127.0.0.1:27017/sports-tournament");
mongoose.connection.on("error", () => {
  log.error("Fallo la conexion a mongodb");
  process.exit(1);
});
mongoose.set("useFindAndModify", false);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "image/*", limit: "25mb" }));

app.use(cors());

app.use(
  morgan("short", {
    stream: {
      write: (message) => log.info(message.trim()),
    },
  })
);

app.use(passport.initialize());

app.use("/user", userRouter);
app.use("/journey", journeyRouter);
app.use("/league", leagueRouter);
app.use("/team", teamRouter);
app.use("/soccerGame", soccerGameRouter);
app.use("/report", reportRouter);

app.use(errorHandler.procesarErroresDeDB);
app.use(errorHandler.procesarErroresDeTamañoDeBody);
if (config.ambiente === "prod") {
  app.use(errorHandler.erroresEnProduccion);
} else {
  app.use(errorHandler.erroresEnDesarrollo);
}

const server = app.listen(config.puerto, () => {
  log.info("Escuchando en el puerto 3000");
  userController.createUserAdmin();
});

module.exports = {
  app,
  server,
};
