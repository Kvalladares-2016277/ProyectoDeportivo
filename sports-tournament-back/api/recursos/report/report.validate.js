const Joi = require('@hapi/joi')
const log = require('../../../utils/logger')

const blueprintReport = Joi.object({
    name: Joi.string(),
    goals: Joi.number().positive().precision(0).required(),
    goalsAgainst: Joi.number().positive().precision(0).required(),
    score: Joi.number().valid(3, 1, 0).required()
})

let validateReport = (req, res, next) => {
    const resultado = blueprintReport.validate(req.body, {abortEarly: false, convert: false})
    if(resultado.error === undefined){
        next();
    }else{
        log.debug(`Fallo en la validacion del reporte: ${resultado.error.details.map((error) => error.message)}`)
        res.status(400).send({message: "La informacion para el reporte no cumple con los requisitos. Verifique que los goles sea positivos y que no tenga punto decimal. Verifique que los goles en contra sean positivos y que no tengan punto decimal. Verifique que los puntos sean 3, 1 o 0."})
    }
}

module.exports = {
    validateReport
}