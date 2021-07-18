const Joi = require("@hapi/joi");
const fileType = require('file-type')
const log = require("./../../../utils/logger");

const blueprintUser = Joi.object({
  username: Joi.string().alphanum().max(40).required(),
  password: Joi.string().min(6).max(200).required(),
  name: Joi.string().min(4).max(100).required(),
  lastname: Joi.string().min(4).max(150).required(),
  role: Joi.string().valid("ROLE_ADMIN", "ROLE_CLIENT").required(),
  img: Joi.optional().allow(""),
  history: Joi.array(),
  leagues: Joi.array(),
});

const CONTENT_TYPES_PERMIT = ['image/jpeg', 'image/jpg', 'image/png']

function validateImage(req, res, next){
    let contentType = req.get('content-type')
    if(!CONTENT_TYPES_PERMIT.includes(contentType)){
        log.warn(`Request para modificar imagen del usuario con id [${req.params.id}] no tiene content-type valido [${contentType}]`)
        res.status(400).send({message: `Archivos de tipo ${contentType} no son soportados. Usar uno de ${CONTENT_TYPES_PERMIT.join(", ")}`})
        return;
    }

    let infoFile = fileType(req.body)
    if(!CONTENT_TYPES_PERMIT.includes(infoFile.mime)){
        const message = `Disparidad entre content-type [${contentType}] y tipo de archivo [${infoFile.ext}]. Request no sera procesado`
        log.warn(`${message}. Request dirigido a usuario con id [${req.params.id}] de usuario [${req.user.username}]`);
        res.status(400).send({message: message})
        return
    }

    req.extensionDeArchivo = infoFile.ext
    next();

}

let validateUser = (req, res, next) => {
  const resultado = blueprintUser.validate(req.body, {
    abortEarly: false,
    convert: false,
  });
  if (resultado.error === undefined) {
    next();
  } else {
    log.debug(
      "Fallo en la validacion del usuario",
      resultado.error.details.map((error) => error.message)
    );
    res
      .status(400)
      .send({
        message:
          "Informacion del usuario no cumple con los requisitos. El nombre de usuario debe ser alfanumerico y tener entre 3 y 30 caracteres. La contraseña debe tener entre 6 y 200 caracteres. El usuario necesita un nombre. el usuario necesita un apellido. asegurese que los roles sean 'ROLE_ADMINAPP' o 'ROLE_CLIENT'.",
      });
  }
};

const blueprintLogin = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string().min(4).max(100).allow(""),
  lastname: Joi.string().min(4).max(150).allow(""),
  role: Joi.string().valid("ROLE_ADMIN", "ROLE_CLIENT").allow(""),
  img: Joi.optional().allow(""),
  history: Joi.array(),
  leagues: Joi.array(),
});

let validateLogin = (req, res, next) => {
  const resultado = blueprintLogin.validate(req.body, {
    abortEarly: false,
    convert: false,
  });
  if (resultado.error === undefined) {
    next();
  } else {
    log.debug(
      "Fallo en la validacion del login",
      resultado.error.details.map((error) => error.message)
    );
    res
      .status(400)
      .send({
        message:
          "Informacion del login no cumple con los requisitos. asegurese de ingresar el nombre de usuario. asegurese de ingresar la contraseña",
      });
  }
};

const blueprintUpdate = Joi.object({
  username: Joi.string().max(40).required(),
  name: Joi.string().min(4).max(100).required(),
  lastname: Joi.string().min(4).max(150).required(),
  role: Joi.string().allow("").optional(),
  img: Joi.optional().allow(""),
  history: Joi.array(),
  leagues: Joi.array(),
});

let validateUpdate = (req, res, next) => {
  const resultado = blueprintUpdate.validate(req.body, {
    abortEarly: false,
    convert: false,
  });
  if (resultado.error === undefined) {
    next();
  } else {
    log.debug(
      "Fallo en la validacion del update",
      resultado.error.details.map((error) => error.message)
    );
    res
      .status(400)
      .send({
        message:
          "Informacion del update no cumple con los requisitos. asegurese de ingresar el nombre de usuario y que tenga entre 4 y 40 caracteres. Asegurese de ingresar el nombre. Asegurese de ingresar los apellidos",
      });
  }
};

module.exports = {
  validateUser,
  validateLogin,
  validateUpdate,
  validateImage
};
