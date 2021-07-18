class UserDataAlreadyInUse extends Error {
  constructor(message) {
    super(message);
    this.message =
      message || "El nombre de usuario ya esta asociado a otra cuenta";
    this.status = 409;
    this.name = "UserDataAlreadyInUse";
  }
}

class IncorrectCredentials extends Error {
  constructor(message) {
    super(message);
    this.message =
      message ||
      "Credenciales incorrectas. Asegurate que el username y contraseña sean correctas.";
    this.status = 400;
    this.name = "IncorrectCredentials";
  }
}

class InvalidUserRole extends Error {
  constructor(message) {
    super(message);
    this.message =
      message || "El Rol de este usuario es invalido para esta operacion";
    this.status = 401;
    this.name = "InvalidUserRole";
  }
}

class UserDoesNotExist extends Error {
  constructor(message) {
    super(message);
    this.message = message || "Usuario no existe en la base de datos";
    this.status = 204;
    this.name = "UserDoesNotExist";
  }
}

class UserDontRemoveAndUpdate extends Error{
  constructor(message){
    super(message);
    this.message = message || "El usuario no se puede eliminar o actualizar por que es administrador"
    this.status = 401;
    this.name = 'UserDontRemoveAndUpdate'
  }
}

module.exports = {
  UserDataAlreadyInUse,
  IncorrectCredentials,
  InvalidUserRole,
  UserDoesNotExist,
  UserDontRemoveAndUpdate
};
