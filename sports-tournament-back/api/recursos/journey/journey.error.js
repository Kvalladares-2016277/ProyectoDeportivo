class JourneyDataAlreadyInUse extends Error {
  constructor(message) {
    super(message);
    this.message = message || "Estos datos ya existen en la base de datos";
    this.status = 409;
    this.name = "JourneyDataAlreadyInUse";
  }
}

class JourneyDoesNotExist extends Error {
  constructor(message) {
    super(message);
    this.message = message || "Esta jornada no existe en la base de datos";
    this.status = 204;
    this.name = "JourneyDoesNotExist";
  }
}

module.exports = {
  JourneyDataAlreadyInUse,
  JourneyDoesNotExist,
};
