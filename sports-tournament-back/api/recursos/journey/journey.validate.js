const Joi = require('@hapi/joi')
const log = require('../../../utils/logger')

const blueprintJourney = Joi.object({
    journey: Joi.string().min(4).max(100).required(),
    soccerGame: Joi.array().optional(),
})

let validateJourney = (req, res, next) => {
    const resultado = blueprintJourney.validate(req.body, {abortEarly: false, convert: false})
    if(resultado.error === undefined){
        next();
    }else{
        log.warn(`Error al validar la jornada: ${resultado.error.details.map((error) => error.message)}`)
        res.status(400).send({menssage: "No cumple con los requisitos minimos. Por favor verifique que tenga un nombre entre 4 y 100 caracteres"})
    }
}

module.exports = {
    validateJourney
}