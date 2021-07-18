const Joi = require('@hapi/joi')
const fileType = require('file-type')
const log = require('../../../utils/logger')

const blueprintTeam = Joi.object({
    name: Joi.string().min(4).max(200).required(),
    img: Joi.optional().allow("")
})

const CONTENT_TYPES_PERMIT = ['image/jpeg', 'image/jpg', 'image/png']

function validateImage(req, res, next){
    let contentType = req.get('content-type')
    if(!CONTENT_TYPES_PERMIT.includes(contentType)){
        log.warn(`Request para modificar imagen del equipo con id [${req.params.id}] no tiene content-type valido [${contentType}]`)
        res.status(400).send({message: `Archivos de tipo ${contentType} no son soportados. Usar uno de ${CONTENT_TYPES_PERMIT.join(", ")}`})
        return;
    }

    let infoFile = fileType(req.body)
    if(!CONTENT_TYPES_PERMIT.includes(infoFile.mime)){
        const message = `Disparidad entre content-type [${contentType}] y tipo de archivo [${infoFile.ext}]. Request no sera procesado`
        log.warn(`${message}. Request dirigido a usuario con id [${req.params.id}] de usuario [${req.user.username}]`)
        res.status(400).send({message: message})
        return
    }

    req.extensionDeArchivo = infoFile.ext
    next();

}

let validateTeam = (req, res, next) => {
    const resultado = blueprintTeam.validate(req.body, {abortEarly: false, convert: false})
    if(resultado.error === undefined){
        next();
    }else{
        log.debug(`Fallo en la validacion del equipo: ${resultado.error.details.map((error) => error.message)}`)
        res.status(400).send({message: "Informacion del equipo no cumple con los requisitos. El nombre tiene que tener entre 4 y 200 caracteres."})
    }
}

const blueprintUpdate = Joi.object({
    name: Joi.string().min(4).max(200).required()
})

let validateUpdate = (req, res, next) => {
    const resultado = blueprintUpdate.validate(req.body, {abortEarly: false, convert: false})
    if(resultado.error === undefined){
        next();
    }else{
        log.debug(`Fallo en la validacion del equipo: ${resultado.error.details.map((error) => error.message)}`)
        res.status(400).send({message: "Informacion del equipo no cumple con los requisitos. El nombre tiene que tener entre 4 y 200 caracteres."})
    }
}

module.exports = {
    validateTeam,
    validateUpdate,
    validateImage
}