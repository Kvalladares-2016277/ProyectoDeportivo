const passportJWT = require("passport-jwt");

const log = require("../../utils/logger");
const config = require("../../config");
const userController = require("../recursos/user/user.controller");

let jwtOptions = {
  secretOrKey: config.jwt.secreto,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
  userController
    .foundOneUser({ id: jwtPayload.id })
    .then((usuario) => {
      if (!usuario) {
        log.debug(
          `JWT Token no valido. Usuario con id [${jwtPayload.id}] no existe`
        );
        next(null, false);
        return;
      }
      log.info(
        `Usuario ${usuario.username} suministro un token valido. Autenticacion completada`
      );
      next(null, {
        username: usuario.username,
        id: usuario.id,
        role: usuario.role,
      });
    })
    .catch((err) => {
      log.error("Error ocurrido al tratar de validar un token", err);
      next(err);
    });
});
