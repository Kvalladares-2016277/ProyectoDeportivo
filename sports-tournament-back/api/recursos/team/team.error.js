class TeamDataAlreadyInUse extends Error{
    constructor(message){
        super(message);
        this.message = message || 'Los datos de este equipo ya existen en la base de datos';
        this.status = 409;
        this.name = 'TeamDataAlreadyInUse';
    }
}

class TeamDoesNotExist extends Error{
    constructor(message){
        super(message);
        this.message = message || 'El equipo que busca no existe en la base de datos';
        this.status = 204;
        this.name = "TeamDoesNotExist";
    }
}

module.exports = {
    TeamDoesNotExist,
    TeamDataAlreadyInUse
}