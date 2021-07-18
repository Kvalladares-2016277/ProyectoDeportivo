const Team = require("./team.model");
const log = require("../../../utils/logger");
const fs = require("fs");
const path = require("path");

function foundTeam() {
  return Team.find({});
}

function createTeam(team) {
  return new Team({
    ...team,
  }).save();
}

function deleteTeam(id) {
  return Team.findByIdAndRemove(id);
}

function updateTeam(id, team) {
  return Team.findOneAndUpdate({ _id: id }, { ...team }, { new: true });
}

function existingTeam(name) {
  return new Promise((resolve, reject) => {
    Team.find()
      .or([{ name: name }])
      .then((teams) => {
        resolve(teams.length > 0);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function foundOneTeam({ name: name, id: id }) {
  if (name) {
    return Team.findOne({ name: name });
  }
  if (id) {
    return Team.findById(id);
  }
  throw new Error(
    "Funcion obtener un equipo del controlador fue llamado sin especificar el nombre o el id"
  );
}

function saveImg(id, imageUrl) {
  return Team.findOneAndUpdate({ _id: id }, { img: imageUrl }, { new: true });
}

function uploadImage(req, res){
  var teamId = req.params.id;
  var files = req.body;
  var fileName;

      if(req.files){
          // Ruta en la que llega la imagen.
          var filePath = req.files.img.path;
          // Split separa en jerarquía la ruta de la imagen. (Para linux es con solo una barra inversa "\").
          var fileSplit = filePath.split('\\') || filePath.split('\\');
          // Obtiene la número 2 sea el caso Documentos/Imágenes/Imagen.jpg 0/1/2.
          var fileName = fileSplit[2];
          // Separa la extensión de lo obtenido arriba y separa la extención Imagen.jpg 0.1.
          var extension = fileName.split('\.');
          var fileExt = extension[1];
          // Tipos de archivos de imagen que aprobará.
          if( fileExt == 'png' ||
              fileExt == 'jpg' ||
              fileExt == 'jpeg' ||
              fileExt == 'gif'){
                  Team.findByIdAndUpdate(teamId, {img: fileName}, {new:true}, (err, teamUpdated)=>{
                      if(err){
                          res.status(500).send({message: 'Error general'});
                          console.log(err);
                      }else if(teamUpdated){
                          res.send({team: teamUpdated, teamImage:teamUpdated.img});
                      }else{
                          res.status(400).send({message: 'No se ha podido actualizar'});
                      }
                  });
              }else{
                  fs.unlink(filePath, (err)=>{ // Se elimina el archivo por no tener una extensión válida.
                      if(err){
                          res.status(500).send({message: 'Extensión no válida y error al eliminar archivo'});
                          console.log(err);
                      }else{
                          res.send({message: 'Extensión no válida'});
                      }
                  })
              }
      }else{
          res.status(400).send({message: 'No has enviado imagen a subir'});
      }
}

function getImage(req, res){
  var fileName = req.params.fileName;
  var pathFile = './uploads/teams/' + fileName;

  fs.exists(pathFile, (exists)=>{
      if(exists){
          res.sendFile(path.resolve(pathFile));
      }else{
          res.status(404).send({message: 'Imagen inexistente'});
      }
  })
}

module.exports = {
  createTeam,
  foundTeam,
  foundOneTeam,
  deleteTeam,
  updateTeam,
  saveImg,
  existingTeam,
  uploadImage,
  getImage
};
