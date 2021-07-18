const mongoose = require("mongoose");

const leagueSchema = new mongoose.Schema({
  name: { type: String, required: [true, "La liga necesita un nombre"] },
  teams: [{ type: mongoose.Schema.ObjectId, ref: "team" }],
  reports: [{ type: mongoose.Schema.ObjectId, ref: "report" }],
  journey: [{ type: mongoose.Schema.ObjectId, ref: "journey" }]
});

module.exports = mongoose.model("league", leagueSchema);
