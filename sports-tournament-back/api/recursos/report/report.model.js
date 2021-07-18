const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  league: { type: mongoose.Schema.ObjectId, ref: "league" },
  team: { type: mongoose.Schema.ObjectId, ref: "team" },
  journey: { type: mongoose.Schema.ObjectId, ref: "journey" },
  goals: {
        type: Number,
        required: [true, "Se necesita los goles anotados"],
      },
      goalsAgainst: {
        type: Number,
        required: [true, "Se necesitan los goles en contra"],
      },
      goalDifference: {
        type: Number,
        required: [true, "Se necesita la diferencia de goles"],
      },
      score: {
        type: Number,
        required: [true, "se necesita los puntos obtenidos"],
      },
      soccerGame: { type: mongoose.Schema.ObjectId, ref: "soccerGame" },
});

module.exports = mongoose.model("report", reportSchema);
