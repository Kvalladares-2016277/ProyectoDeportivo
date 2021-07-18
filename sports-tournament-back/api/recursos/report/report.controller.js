const Report = require("../report/report.model");

function foundReport() {
  return Report.find({})
    .populate("league")
    .populate("journey")
    .populate("team")
    .populate("soccerGame");
}

function createReport(
  report,
  journey,
  league,
  team,
  soccerGame,
  goalDifference
) {
  return new Report({
        league: league,
        team: team,
        journey: journey,
        goals: report.goals,
        goalsAgainst: report.goalsAgainst,
        goalDifference: goalDifference,
        score: report.score,
        soccerGame: soccerGame,
  }).save();
}

function deleteReport(id) {
  return Report.findByIdAndRemove(id);
}

function updateReport(id, report, league, team, soccerGame, goalDifference) {
  return Report.findOneAndUpdate(
    { _id: id },
    {
      league: league,
      team: team,
      goals: report.goals,
      goalsAgainst: report.goalsAgainst,
      goalDifference: goalDifference,
      score: report.score,
      soccerGame: soccerGame,
    },
    { new: true }
  );
}

function foundOneReport({ id: id }) {
  if (id) {
    return Report.findById(id)
      .populate("league")
      .populate("journey")
      .populate("team")
      .populate("soccerGame");
  }
  throw new Error(
    "Funcion obtener un reporte del controlador fue llamado sin especificar el id del reporte"
  );
}

module.exports = {
  createReport,
  deleteReport,
  updateReport,
  foundReport,
  foundOneReport,
};
