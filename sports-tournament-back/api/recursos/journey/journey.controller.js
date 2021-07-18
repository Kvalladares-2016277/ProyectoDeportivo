const Journey = require('./journey.model')

function foundJourney(){
    return Journey.find({}).populate('soccerGame')
}

function createJourney(journey){
    return new Journey({
        ...journey
    }).save()
}

function deleteJourney(id){
    return Journey.findByIdAndRemove(id);
}

function updateJourney(id, journey){
    return Journey.findOneAndUpdate({_id: id}, {...journey}, {new: true});
}

function setSoccerGame(id, soccerGame){
    return Journey.findOneAndUpdate({_id: id}, {$push:{soccerGame: soccerGame}}, {new:true});
}

function deleteSoccerGame(id, soccerGame){
    return Journey.findOneAndUpdate({_id: id}, {$pull:{soccerGame: soccerGame}}, {new:true});
}

function existingJourney(name){
    return new Promise((resolve, reject) => {
        Journey.find().or([{journey: name}]).populate('soccerGame')
            .then((journey) => {
                resolve(journey.length > 0)
            })
            .catch((err) => {
                reject(err);
            })
    })
}

function foundOneJourney({id: id, name: name}){
    if(id){
        Journey.findById(id).populate('soccerGame')
    }else if(name){
        Journey.findOne({journey: name}).populate('soccerGame')
    }else{
    throw new Error("Funcion obtener una jornada del controlador fue llamado sin especificar el id o el nombre")
    }

}

module.exports = {
    foundJourney,
    createJourney,
    deleteJourney,
    updateJourney,
    existingJourney,
    foundOneJourney,
    setSoccerGame,
    deleteSoccerGame
}