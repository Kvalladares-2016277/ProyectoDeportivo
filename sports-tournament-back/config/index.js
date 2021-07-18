const ambiente = process.env.NODE_ENV || 'development'

const configuracionBase = {
    jwt: {},
    puerto: 3000,
    s3: {
        accessKeyId: 'AKIA2JOQ4UWYYSJ7BUHK',
        secretAccessKey: '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'
    }
}

let configuracionDeAmbiente = {}

switch(ambiente){
    case 'desarrollo':
    case 'dev':
    case 'development':
        configuracionDeAmbiente = require('./dev')
        break
    case 'produccion':
    case 'prod':
        configuracionDeAmbiente = require('./prod')
        break
    default:
        configuracionDeAmbiente = require('./dev')
}

module.exports = {
    ...configuracionBase,
    ...configuracionDeAmbiente
}