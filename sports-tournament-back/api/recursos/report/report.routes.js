const express = require("express");
const passport = require("passport");

const log = require("../../../utils/logger");
const validateReport = require("./report.validate").validateReport;
const reportController = require("./report.controller");
const leagueController = require("../league/league.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const {
  ReportDataAlreadyInUse,
  ReportDoesNotExist,
} = require("./report.error");

const jwtAuthenticate = passport.authenticate("jwt", { session: false });
const reportRouter = express.Router();

function validarId(req, res, next) {
  let id = req.params.id;
  if (id.match(/^[a-fA-F0-9]{24}$/) === null) {
    res
      .status(400)
      .send({ message: `El id [${id}] suministrado en el URL no existe` });
    return;
  }
  next();
}

reportRouter.get(
  "/",
  jwtAuthenticate,
  procesarErrores((req, res) => {
    return reportController.foundReport().then((reports) => {
      res.send({ message: "Reportes encontrados", report: reports });
    });
  })
);

reportRouter.get(
  "/oneReport/:id",
  [jwtAuthenticate, validarId],
  procesarErrores((req, res) => {
    let id = req.params.id;
    return reportController.foundOneReport({ id: id }).then((report) => {
      res.send({ message: "Reporte encontrado", report: report });
    });
  })
);

reportRouter.post(
  "/create/:idL/:idT/:idS/:idJ",
  [jwtAuthenticate, validateReport],
  procesarErrores(async (req, res) => {
    let newReport = req.body;
    let goals = req.body.goals;
    let goalsAgainst = req.body.goalsAgainst;
    let idJourney = req.params.idJ;
    let idLeague = req.params.idL;
    let idTeam = req.params.idT;
    let idSoccerGame = req.params.idS;

    let goalDifference = goals - goalsAgainst;

    if (goalDifference < 0) {
      log.debug(`La diferencia de goles es negativa [${goalDifference}]`);
      goalDifference = goalDifference * -1;
      log.debug(
        `la diferencia de goles paso a ser positiva [${goalDifference}]`
      );
    }

    reportController
      .createReport(newReport, idJourney, idLeague, idTeam, idSoccerGame, goalDifference)
      .then((report) => {
        log.debug(`Reporte creado`);
        leagueController
          .setReports(idLeague, report.id)
          .then((leagueUpdate) => {
            res
              .status(201)
              .send({
                message: "El reporte fue creado con exito",
                report: report,
              });
            log.info(
              `La liga con id [${idLeague}] ha sido actualizado con un reporte`
            );
          });
      });
  })
);

reportRouter.put(
  "/:id/:idL/:idT/:idS",
  [jwtAuthenticate, validateReport],
  procesarErrores(async (req, res) => {
    let idReport = req.params.id;
    let idLeague = req.params.idL;
    let idTeam = req.params.idT;
    let idSoccerGame = req.params.idS;
    let goals = req.body.goals;
    let goalsAgainst = req.body.goalsAgainst;
    let updateReport;

    updateReport = await reportController.foundOneReport({ id: idReport });

    if (!updateReport) {
      log.warn(
        `El reporte con id [${idReport}] que busca no existe en la base de datos`
      );
      throw new ReportDoesNotExist();
    }

    let goalDifference = goals - goalsAgainst;

    if (goalDifference < 0) {
      log.debug(`La diferencia de goles es negativa [${goalDifference}]`);
      goalDifference = goalDifference * -1;
      log.debug(
        `La diferencia de goles paso a ser positiva [${goalDifference}]`
      );
    }

    reportController
      .updateReport(
        idReport,
        req.body,
        idLeague,
        idTeam,
        idSoccerGame,
        goalDifference
      )
      .then((report) => {
        res
          .status(200)
          .send({ message: "Reporte actualizado", report: report });
        log.info(`El reporte con id [${idReport}] ha sido actualizado`);
      });
  })
);

reportRouter.delete(
  "/:id/:idL",
  [jwtAuthenticate],
  procesarErrores(async (req, res) => {
    let id = req.params.id;
    let idLeague = req.params.idL;
    let reportDelete;

    reportDelete = await reportController.foundOneReport({ id: id });

    if (!reportDelete) {
      log.warn(
        `El reporte con id [${id}] que busca no existe en la base de datos`
      );
      throw new ReportDoesNotExist();
    }

    let reportRemoved = await reportController.deleteReport(id);
    log.info(`El reporte con id [${id}] ha sido eliminado con exito`);
    leagueController.deleteReport(idLeague, id).then((leagueUpdate) => {
      res
      .status(200)
      .send({ message: "Reporte eliminado", reportDelete: reportRemoved });
    })
    
    
  })
);

module.exports = reportRouter;
