const mongoose = require('mongoose')
const log = require('../../utils/logger')

exports.procesarErrores = (fn) => {
    return function(req, res, next){
        fn(req, res, next).catch(next)
    }
}

exports.procesarErroresDeDB = (err, req, res, next) => {
    if(err instanceof mongoose.Error || err.name === 'MongoError'){
        log.error("Ocurrio un error relacionado con la base de datos", err)
        err.message = "Error relacionado con la base de datos ocurrio inesperadamente. por favor comunicate con un desarrollador"
        err.status = 500
    }
    next(err)
}

exports.procesarErroresDeTamañoDeBody = (err, req, res, next) => {
    if(err.status === 413){
        log.error(`Request enviado a la ruta [${req.path}] excedio el limite de tamaño. Request no sera procesado.`)
        err.message = `El body enviado en el request a la ruta [${req.path}] pasa el limite de tamaño. Maximo permitido es ${err.limit} bytes`
    }
    next(err)
}

exports.erroresEnProduccion = (err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        message: err.message
    })
}

exports.erroresEnDesarrollo = (err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        message: err.message,
        stack: err.stack || ''
    })
}