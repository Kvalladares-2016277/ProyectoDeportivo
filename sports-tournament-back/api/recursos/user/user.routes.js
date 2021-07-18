const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const uuidv4 = require("uuid/v4");

const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/users'});

const log = require("./../../../utils/logger");
const config = require("../../../config");
const validateUser = require("./user.validate").validateUser;
const validateLogin = require("./user.validate").validateLogin;
const validateUpdate = require("./user.validate").validateUpdate;
const validateImage = require("./user.validate").validateImage;
const userController = require("./user.controller");
const { saveImageUser } = require("../../data/images.controller");
const procesarErrores = require("./../../libs/errorHandler").procesarErrores;
const {
  UserDataAlreadyInUse,
  IncorrectCredentials,
  UserDontRemoveAndUpdate,
  UserDoesNotExist,
} = require("./user.error");

const jwtAuthenticate = passport.authenticate("jwt", { session: false });
const userRouter = express.Router();

function transformBodyToLowerCase(req, res, next) {
  req.body.username && (req.body.username = req.body.username.toLowerCase());
  req.body.name && (req.body.name = req.body.name.toLowerCase());
  req.body.lastname && (req.body.lastname = req.body.lastname.toLowerCase());
  next();
}

function validarId(req, res, next) {
  let id = req.params.id;

  if (id.match(/^[a-fA-F0-9]{24}$/) === null) {
    res
      .status(400)
      .send({ message: `El id [${id}] suministrado en el URL no es valido` });
    return;
  }
  next();
}

userRouter.get(
  "/getUsers",
  procesarErrores((req, res) => {
    return userController.foundUser().then((users) => {
      res.send({ users: users });
    });
  })
);

userRouter.get(
  "/oneUser/:id",
  [jwtAuthenticate, validarId],
  procesarErrores((req, res) => {
    let id = req.params.id;
    return userController.foundOneUser({ id: id }).then((foundUser) => {
      res.status(200).send({ user: foundUser });
    });
  })
);

userRouter.post(
  "/create",
  [validateUser, transformBodyToLowerCase],
  procesarErrores((req, res) => {
    let newUser = req.body;
    return userController
      .existingUser(newUser.username)
      .then((foundUser) => {
        if (foundUser) {
          log.warn(
            `usuario con username [${newUser.username}] ya existen en la base de datos`
          );
          throw new UserDataAlreadyInUse();
        }
        return bcrypt.hash(newUser.password, 10);
      })
      .then((hash) => {
        return userController
          .createUser(newUser, hash)
          .then((newUserCreated) => {
            res
              .status(201)
              .send({ message: "usuario creado", user: newUserCreated });
          });
      });
  })
);

userRouter.post(
  "/login",
  [validateLogin, transformBodyToLowerCase],
  procesarErrores(async (req, res) => {
    let userNotAuthenticate = req.body;

    let userRegistered = await userController.foundOneUser({
      username: userNotAuthenticate.username,
    });

    if (!userRegistered) {
      log.info(
        `Usuario [${userNotAuthenticate.username}] no existe. No puede ser autenticado`
      );
      throw new IncorrectCredentials();
    }
    let correctPassword = await bcrypt.compare(
      userNotAuthenticate.password,
      userRegistered.password
    );

    if (correctPassword) {
      let token = jwt.sign({ id: userRegistered._id }, config.jwt.secreto, {
        expiresIn: config.jwt.tiempoDeExpiracion,
      });
      log.info(
        `Usuario [${userNotAuthenticate.username}] completo la autenticacion con exito`
      );
      res.status(200).send({ token: token, user: userRegistered });
    } else {
      log.info(
        `Usuario ${userNotAuthenticate.username} no completo autenticacion. Contraseña incorrecta`
      );
      throw new IncorrectCredentials();
    }
  })
);

userRouter.put("/updatePassword/:id", [jwtAuthenticate, validarId], procesarErrores(async(req, res) => {
  let password = req.body;
  let id = req.params.id

  let userRegistered = await userController.foundOneUser({id: id });

  if(!userRegistered){
    log.info(`Usuario con id [${id}] no existe.`)
    throw new IncorrectCredentials();
  }

  let correctPassword = await bcrypt.compare(password.current, userRegistered.password);

  if(correctPassword){
    log.debug(`Usuario con id [${id}] ingreso su contraseña correcta`)
    return bcrypt.hash(password.new, 10).then((hashPassword) => {
      return userController.updatePassword(userRegistered._id, hashPassword).then((userUpdated) => {
        let token = jwt.sign({id: userUpdated._id}, config.jwt.secreto, {expiresIn: config.jwt.tiempoDeExpiracion});
        res.status(201).send({message: "El usuario actualizo su contraseña de forma correcta", user: userUpdated, token: token})
      })
    })
  }

}))

userRouter.put(
  "/updateUser/:id",
  [jwtAuthenticate, validarId, validateUpdate],
  procesarErrores(async (req, res) => {
    let id = req.params.id;
    let updateUser;

    updateUser = await userController.foundOneUser({ id: id });

    if (!updateUser) {
      log.info(`El usuario con id [${id}] no existe`);
      throw new UserDoesNotExist();
    }

    userController.updateUser(id, req.body).then((user) => {
      res.status(200).send({ message: "Usuario actualizado", user: user });
      log.info(`Usuario con id [${id}] ha sido actualizado con exito`);
    });
  })
);

userRouter.delete(
  "/deleteUser/:id",
  [jwtAuthenticate, validarId],
  procesarErrores(async (req, res) => {
    let id = req.params.id;
    let deleteUser;

    deleteUser = await userController.foundOneUser({ id: id });

    if (!deleteUser) {
      log.info(`El Usuario con id [${id}] no existe en la base de datos`);
      throw new UserDoesNotExist(
        `Usuario con id [${id}] no existe. No se puede borrar nada`
      );
    }

    let idUser = req.user.id;
    let roleUser = req.user.role;

    if (idUser !== id && roleUser !== 'ROLE_ADMIN') {
      log.info(`El usuario con id [${idUser}] no coincide con el id enviado`);
      throw new IncorrectCredentials(`Los id no coinciden`);
    }

    let userRemoved = await userController.deleteUser(id);
    log.info(`El usuario con id [${id}] fue eliminado`);
    res.status(200).send({ message: "Usuario eliminado", user: userRemoved });
  })
);

userRouter.put(
  "/:id/image",
  [jwtAuthenticate, validateImage],
  procesarErrores(async (req, res) => {
    const id = req.params.id;
    const user = req.user.username;
    log.debug(
      `Request recibido de usuario [${user}] para guardar imagen del usuario`
    );

    const nameRandom = `${uuidv4()}.${req.extensionDeArchivo}`;

    await saveImageUser(req.body, nameRandom);

    const urlImage = `https://data-image-sports-tournament.s3.us-east-2.amazonaws.com/images-users/${nameRandom}`;

    const userUpdated = await userController.saveimg(id, urlImage);

    log.info(
      `Imagen de usuario con id [${id}] fue modificada. Link a nueva imagen [${urlImage}].`
    );
    res.status(200).send({ message: "Imagen subida", user: userUpdated });
  })
);

userRouter.put("/uploadUserImage/:id", [jwtAuthenticate, upload],userController.uploadImage);
userRouter.get("/getUserImage/:fileName", [upload], userController.getImage);

module.exports = userRouter;
