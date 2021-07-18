const Joi = require('@hapi/joi')
const log = require('../../../utils/logger')

const blueprintLeague = Joi.object({
    name: Joi.string().min(4).max(200).required()
})

let validateLeague = (req, res, next) => {
    const resultado = blueprintLeague.validate(req.body, {abortEarly: false, convert: false})
    if(resultado.error === undefined){
        next();
    }else{
        log.debug(`Fallo en la validacion de la liga: ${resultado.error.details.map((error) => error.message)}`)
        res.status(400).send({message: "Informacion de la liga no cumple con los requisitos. El nombre tiene que tener entre 4 y 200 caracteres."})
    }
}

module.exports = {
    validateLeague
}