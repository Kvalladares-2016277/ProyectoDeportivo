class LeagueDataAlreadyInUse extends Error{
    constructor(message){
        super(message);
        this.message = message || 'Los datos de esta liga ya existen en la base de datos';
        this.status = 409;
        this.name = "LeagueDataAlreadyInUse"
    }
}

class LeagueDoesNotExist extends Error{
    constructor(message){
        super(message);
        this.message = message || 'La liga que busca no existe en la base de datos'
        this.status = 204;
        this.name = "LeagueDoesNotExist";
    }
}

module.exports = {
    LeagueDataAlreadyInUse,
    LeagueDoesNotExist
}