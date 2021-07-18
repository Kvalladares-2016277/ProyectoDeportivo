const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema({
  journey: {
    type: String,
    required: [true, "La jornada necesita un nombre"],
  },
  soccerGame: [{ type: mongoose.Schema.ObjectId, ref: "soccerGame" }],
});

module.exports = mongoose.model("journey", journeySchema);
