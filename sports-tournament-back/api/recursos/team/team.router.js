const express = require("express");
const passport = require("passport");
const uuidv4 = require("uuid/v4");

const log = require("../../../utils/logger");
const validateTeam = require("./team.validate").validateTeam;
const validateUpdate = require("./team.validate").validateUpdate;
const validateImage = require("./team.validate").validateImage;
const teamController = require("./team.controller");
const leagueController = require("../league/league.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const { saveImageTeam } = require("../../data/images.controller");
const { TeamDataAlreadyInUse, TeamDoesNotExist } = require("./team.error");

const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/teams'});

const jwtAuthenticate = passport.authenticate("jwt", { session: false });
const teamRouter = express.Router();

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

teamRouter.get(
  "/",
  jwtAuthenticate,
  procesarErrores((req, res) => {
    return teamController.foundTeam().then((teams) => {
      res.send({ message: "Equipos encontrados", team: teams });
    });
  })
);

teamRouter.get(
  "/oneTeam/:id",
  [jwtAuthenticate, validarId],
  procesarErrores((req, res) => {
    let id = req.params.id;
    return teamController.foundOneTeam({ id: id }).then((foundTeam) => {
      res.status(200).send({ message: "Equipo encontrado", team: foundTeam });
    });
  })
);

teamRouter.post(
  "/create/:id",
  [jwtAuthenticate, validateTeam, transformBodyToLowerCase],
  procesarErrores(async (req, res) => {
    let newTeam = req.body;
    let idLeague = req.params.id;
    let teamExisting;

    teamExisting = await teamController.foundOneTeam({ name: newTeam.name });

    if (teamExisting) {
      log.warn(`Ya existe un equipo con el nombre [${newTeam.name}]`);
      throw new TeamDataAlreadyInUse();
    }

    teamController.createTeam(newTeam).then((team) => {
      log.info(`El equipo ha sido creado`);
      leagueController.setTeam(idLeague, team.id).then((leagueUpdated) => {
        res.status(201).send({ message: "Equipo creado", team: team });
        log.info(`Se añadio un equipo a la liga`);
      });
    });
  })
);

teamRouter.put(
  "/updateTeam/:id",
  [jwtAuthenticate, validarId, validateUpdate],
  procesarErrores(async (req, res) => {
    let id = req.params.id;
    let updateTeam;

    updateTeam = await teamController.foundOneTeam({ id: id });

    if (!updateTeam) {
      log.warn(
        `El equipo con id [${id}] que busca no existe en la base de datos`
      );
      throw new TeamDoesNotExist();
    }

    teamController.updateTeam(id, req.body).then((team) => {
      res.status(200).send({ message: "Equipo actualizado", team: team });
      log.info(`El equipo con id [${id}] ha sido actualizado`);
    });
  })
);

teamRouter.delete(
  "/deleteTeam/:id/:idL",
  [jwtAuthenticate],
  procesarErrores(async (req, res) => {
    let id = req.params.id;
    let idLeague = req.params.idL;
    let teamDelete;

    teamDelete = await teamController.foundOneTeam({ id: id });

    if (!teamDelete) {
      log.warn(
        `El equipo con id [${id}] que busca no existe en la base de datos`
      );
      throw new TeamDoesNotExist();
    }

    let teamRemoved = await teamController.deleteTeam(id);
    log.info(`El equipo con id [${id}] ha sido eliminado con exito`);
    leagueController.deleteTeam(idLeague, id).then((leagueUpdated) => {
      res.status(200).send({ message: "Equipo eliminado", team: teamRemoved });
    })
    
    
  })
);

/*teamRouter.put(
  "/updateImage/:id/image",
  [jwtAuthenticate, validateImage],
  procesarErrores(async (req, res) => {
    const id = req.params.id;
    log.debug(
      `Request recibido del equipo con id [${id}] para guardar imagen del equipo`
    );
    const nameRandom = `${uuidv4()}.${req.extensionDeArchivo}`;
    await saveImageTeam(req.body, nameRandom);

    const urlImage = `https://data-image-sports-tournament.s3.us-east-2.amazonaws.com/images-teams/${nameRandom}`;

    const teamUpdated = await teamController.saveImg(id, urlImage);

    log.info(
      `Imagen del equipo con id [${id}] fue modificada. Link a nuevo imagen [${urlImage}].`
    );
    res.status(200).send({ message: "Imagen subida", team: teamUpdated });
  })
);*/

teamRouter.put("/uploadTeamImage/:id", [jwtAuthenticate, upload],teamController.uploadImage);
teamRouter.get("/getTeamImage/:fileName", [upload], teamController.getImage);

module.exports = teamRouter;
