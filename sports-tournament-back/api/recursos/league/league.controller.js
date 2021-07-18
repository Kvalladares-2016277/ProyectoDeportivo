const League = require("./league.model");

function foundLeague() {
  return League.find({})
    .populate("user")
    .populate("teams")
    .populate("journey")
    .populate("matchesTeams")
    .populate("journey")
    .populate("reports");
}

function createLeague(league) {
  return new League({
    ...league,
  }).save();
}

function deleteLeague(id) {
  return League.findByIdAndRemove(id);
}

function updateLeague(id, league) {
  return League.findOneAndUpdate({ _id: id }, { ...league }, { new: true });
}

function setTeam(id, team) {
  return League.findOneAndUpdate(
    { _id: id },
    { $push: { teams: team } },
    { new: true }
  );
}

function setJourney(id, journey) {
  return League.findOneAndUpdate(
    { _id: id },
    { $push: { journey: journey } },
    { new: true }
  );
}

function setReports(id, report) {
  return League.findOneAndUpdate(
    { _id: id },
    { $push: { reports: report } },
    { new: true }
  );
}

function deleteTeam(id, team) {
  return League.findOneAndUpdate(
    { _id: id },
    { $pull: { teams: team } },
    { new: true }
  );
}

function deleteReport(id, report) {
  return League.findOneAndUpdate(
    { _id: id },
    { $pull: { reports: report } },
    { new: true }
  );
}

function existingLeague(name) {
  return new Promise((resolve, reject) => {
    League.find()
      .or([{ name: name }])
      .populate("user")
      .populate("teams")
      .populate("journey")
      .populate("matchesTeams")
      .populate("journey")
      .populate("reports")
      .then((league) => {
        resolve(league.length > 0);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function foundOneLeague({ name: name, id: id }) {
  if (name) {
    return League.findOne({ name: name })
      .populate("user")
      .populate("teams")
      .populate("journey")
      .populate("matchesTeams")
      .populate("journey")
      .populate("reports");
  }
  if (id) {
    return League.findById(id)
      .populate("user")
      .populate("teams")
      .populate("journey")
      .populate("matchesTeams")
      .populate("journey")
      .populate("reports");
  }
  throw new Error(
    "Funcion obtener una liga del controlador fue llamado sin especificar el nombre o id"
  );
}

module.exports = {
  createLeague,
  foundLeague,
  updateLeague,
  deleteLeague,
  setTeam,
  setReports,
  existingLeague,
  foundOneLeague,
  deleteTeam,
  deleteReport,
  setJourney
};
