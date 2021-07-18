const express = require("express");
const passport = require("passport");

const log = require("../../../utils/logger");
const validateJourney = require("./journey.validate").validateJourney;
const journeyController = require("./journey.controller");
const leagueController = require("../league/league.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const {
  JourneyDataAlreadyInUse,
  JourneyDoesNotExist,
} = require("./journey.error");

const jwtAuthenticate = passport.authenticate("jwt", { session: false });
const journeyRouter = express.Router();

function transformBodyToLowerCase(req, res, next) {
  req.body.journey && (req.body.journey = req.body.journey.toLowerCase());
  next();
}

function validarId(req, res, next) {
  let id = req.params.id;
  if (id.match(/^[a-fA-F0-9]{24}$/) === null) {
    res
      .status(400)
      .send({ message: `El id [${id}] suministrado en el URL no es valido` });
    return;
  }
  next();
}

journeyRouter.get(
  "/",
  [jwtAuthenticate],
  procesarErrores((req, res) => {
    return journeyController.foundJourney().then((journeys) => {
      res.send({ message: "Jornadas encontradas", journey: journeys });
    });
  })
);

journeyRouter.get(
  "/oneJourney/:id",
  [jwtAuthenticate, validarId],
  procesarErrores((req, res) => {
    let id = req.params.id;
    return journeyController.foundOneJourney({ id: id }).then((journey) => {
      res.status(200).send({ message: "Jornada encontrada", journey: journey });
    });
  })
);

journeyRouter.post(
  "/:id/create",
  [jwtAuthenticate, validateJourney, transformBodyToLowerCase],
  procesarErrores(async (req, res) => {
    let newJourney = req.body;
    let journeyExisting;
    let id = req.params.id;

    journeyController.createJourney(newJourney).then((journey) => {
      log.debug(`La Jornada ha sido creada con exito`);
      leagueController.setJourney(id, journey._id).then((leagueUpdated) => {
        log.debug(`La liga fue actualizada con exito`);
        res.status(201).send({ message: "Jornada creada", journey: journey, league: leagueUpdated });
      });
    });
  })
);

journeyRouter.put(
  "/:id",
  [jwtAuthenticate, validarId, validateJourney],
  procesarErrores(async (req, res) => {
    let id = req.params.id;
    let updateJourney;

    updateJourney = await journeyController.foundOneJourney({ id: id });

    if (!updateJourney) {
      log.warn(
        `La jornada con id [${id}] que busca no existe en la base de datos`
      );
      throw new JourneyDoesNotExist();
    }

    journeyController.updateJourney(id, req.body).then((journey) => {
      res
        .status(200)
        .send({ message: "Jornada actualizada", journey: journey });
      log.info(`Jornada con id [${id}] ha sido actualizada`);
    });
  })
);

journeyRouter.delete(
  "/:id",
  [jwtAuthenticate, validarId],
  procesarErrores(async (req, res) => {
    let id = req.params.id;
    let journeyDelete;

    journeyDelete = await journeyController.foundOneJourney({ id: id });

    if (!journeyDelete) {
      log.warn(
        `La jornada con id [${id}] que busca no existe en la base de datos`
      );
      throw new JourneyDoesNotExist();
    }

    let journeyRemoved = await journeyController.deleteJourney(id);
    res
      .status(200)
      .send({ message: "Jornada eliminada", journey: journeyRemoved });
    log.info(`La jornada con id [${id}] ha sido eliminado con exito`);
  })
);

module.exports = journeyRouter;
