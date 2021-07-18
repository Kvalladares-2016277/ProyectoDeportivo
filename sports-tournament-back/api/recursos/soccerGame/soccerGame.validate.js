const Joi = require('@hapi/joi');
const log = require('../../../utils/logger')

const blueprintSoccerGame = Joi.object({
    dateMatch: Joi.required(),
    timeMatch: Joi.required(),
    goalsTeamOne: Joi.required(),
    goalsTeamTwo: Joi.required()
})

let validateSoccerGame = (req, res, next) => {
    const resultado = blueprintSoccerGame.validate(req.body, {abortEarly: false, convert: false})
    if(resultado.error === undefined){
        next();
    }else{
        log.debug(`Fallo en la validacion del partido: ${resultado.error.details.map((error) => error.message)}`)
        res.status(400).send({message: "Informacion del partido no cumple con los requisitos: asegurate que el partido tenga una fecha y una hora. Asegurate que existan los dos equipos que van a participar."})
    }
}

const blueprintUpdate = Joi.object({
    dateMatch: Joi.required(),
    timeMatch: Joi.required()
})

let validateUpdate = (req, res, next) => {
    const resultado = blueprintUpdate.validate(req.body, {abortEarly: false, convert: false})
    if(resultado.error === undefined){
        next();
    }else{
        log.debug(`Fallo en la validacion del partido: ${resultado.error.details.map((error) => error.message)}`)
        res.status(400).send({message: "Informacion del partido no cumple con los requisitos: asegurate que el partido tenga una fecha y una hora."})
    }
}

module.exports = {
    validateSoccerGame,
    validateUpdate
}