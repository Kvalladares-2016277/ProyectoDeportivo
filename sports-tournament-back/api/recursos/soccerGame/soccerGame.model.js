const mongoose = require("mongoose");

const soccerGameSchema = new mongoose.Schema({
  dateMatch: {
    type: String,
    required: [true, "Se necesita la fecha del partido"],
  },
  timeMatch: {
    type: String,
    required: [true, "Se necesita la hora del partido"],
  },
  teamOne: {
    team: { type: mongoose.Schema.ObjectId, ref: "team" },
    goals: {
      type: Number,
    },
  },
  teamTwo: {
    team: { type: mongoose.Schema.ObjectId, ref: "team" },
    goals: {
      type: Number,
    },
  },
});

module.exports = mongoose.model("soccerGame", soccerGameSchema);
