class SoccerGameDataAlreadyInUse extends Error{
    constructor(message){
        super(message);
        this.message = message || 'Los datos de este partido ya existen en la base de datos';
        this.status = 409;
        this.name = 'SoccerGameDataAlreadyInUse'
    }
}

class SoccerGameDoesNotExist extends Error{
    constructor(message){
        super(message);
        this.message = message || 'El partido que busca no existe en la base de datos';
        this.status = 204;
        this.name = 'SoccerGameDoesNotExist';
    }
}

module.exports = {
    SoccerGameDataAlreadyInUse,
    SoccerGameDoesNotExist
}