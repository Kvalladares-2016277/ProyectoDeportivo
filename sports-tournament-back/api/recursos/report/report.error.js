class ReportDataAlreadyInUse extends Error{
    constructor(message){
        super(message);
        this.message = message || 'Los datos de este reporte ya existen en la base de datos'
        this.status = 409;
        this.name = 'ReportDataAlreadyInUse';
    }
}

class ReportDoesNotExist extends Error{
    constructor(message){
        super(message);
        this.message = message || 'El reporte que busca no existe en la base de datos'
        this.status = 204;
        this.name = 'ReportDoesNotExist'
    }
}

module.exports = {
    ReportDataAlreadyInUse,
    ReportDoesNotExist
}