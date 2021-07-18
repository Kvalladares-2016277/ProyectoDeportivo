const express = require("express");
const passport = require("passport");

const log = require("../../../utils/logger");
const validateLeague = require("./league.validate").validateLeague;
const leagueController = require("./league.controller");
const userController = require('../user/user.controller');
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const {
  LeagueDataAlreadyInUse,
  LeagueDoesNotExist,
} = require("./league.error");

const jwtAuthenticate = passport.authenticate("jwt", { session: false });
const leagueRouter = express.Router();

function transformBodyToLowerCase(req, res, next) {
  req.body.name && (req.body.name = req.body.name.toLowerCase());
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

leagueRouter.get(
  "/getLeagues",
  jwtAuthenticate,
  procesarErrores((req, res) => {
    return leagueController.foundLeague().then((leagues) => {
      res.send({ message: "Ligas encontradas", league: leagues });
    });
  })
);

leagueRouter.get(
  "/oneLeague/:id",
  [jwtAuthenticate, validarId],
  procesarErrores((req, res) => {
    let id = req.params.id;
    return leagueController.foundOneLeague({ id: id }).then((foundLeague) => {
      res.status(200).send({ message: "Liga encontrada", league: foundLeague });
    });
  })
);

leagueRouter.post(
  "/create",
  [jwtAuthenticate, validateLeague, transformBodyToLowerCase],
  procesarErrores(async (req, res) => {
    let newLeague = req.body;
    let leagueExisting;

    leagueExisting = await leagueController.foundOneLeague({
      name: newLeague.name,
    });

    if (leagueExisting) {
      log.warn(`Ya existe una liga con el nombre [${leagueExisting.name}]`);
      throw new LeagueDataAlreadyInUse();
    }

    leagueController.createLeague(newLeague).then((league) => {
      log.debug(`La liga ha sido creada con exito`);
      userController.setLeague(req.user.id, league._id).then((userUpdated) => {
        log.info(`El usuario con id [${req.user.id}] ha sido actualizado con su nueva liga`)
        res.status(201).send({ message: "Liga creada", league: league });
      })
      
    });
  })
);

leagueRouter.put(
  "/updateLeague/:id",
  [jwtAuthenticate, validarId, validateLeague],
  procesarErrores(async (req, res) => {
    let id = req.params.id;
    let updateLeague;

    updateLeague = await leagueController.foundOneLeague({ id: id });

    if (!updateLeague) {
      log.warn(
        `La liga con id [${id}] que busca no existe en la base de datos`
      );
      throw new LeagueDoesNotExist();
    }

    leagueController.updateLeague(id, req.body).then((league) => {
      res.status(200).send({ message: "Liga actualizada", league: league });
      log.info(`Liga con id [${id}] ha sido actualizada`);
    });
  })
);

leagueRouter.delete(
  "/deleteLeague/:id",
  [jwtAuthenticate],
  procesarErrores(async (req, res) => {
    let id = req.params.id;
    let deleteLeague;

    deleteLeague = await leagueController.foundOneLeague({ id: id });

    if (!deleteLeague) {
      log.warn(`La liga con id [${id}] no existe en la base de datos`);
      throw new LeagueDoesNotExist();
    }

    let leagueRemoved = await leagueController.deleteLeague(id);
    log.debug(`La liga con id [${id}] ha sido eliminada con exito`);
    userController.deleteLeague(req.user.id, id).then((userUpdated) => {
      log.info(`Usuario con id [${req.user.id}] fue actualizado y se elimino su liga`)
      res.status(200).send({ message: "Liga eliminada", league: leagueRemoved });
    })
    
  })
);

module.exports = leagueRouter;
