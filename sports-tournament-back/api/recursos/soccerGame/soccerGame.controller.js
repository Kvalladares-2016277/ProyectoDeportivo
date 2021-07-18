const SoccerGame = require('./soccerGame.model')

function foundSoccerGame(){
    return SoccerGame.find({}).populate('team')
}

function createSoccerGame(soccerGame, teamOne, goalsTeamOne, teamTwo, goalsTeamTwo){
    return new SoccerGame({
        ...soccerGame,
        teamOne: {
            team: teamOne,
            goals: goalsTeamOne
        },
        teamTwo: {
            team: teamTwo,
            goals: goalsTeamTwo
        }
    }).save()
}

function deleteSoccerGame(id){
    return SoccerGame.findByIdAndRemove(id)
}

function updateSoccerGame(id, soccerGame){
    return SoccerGame.findOneAndUpdate({_id: id}, {...soccerGame}, {new: true})
}

function existingSoccerGame(date){
    return new Promise((resolve, reject) => {
        SoccerGame.find().or([{dateMatch: date}]).populate('team')
        .then((soccerGame) => {
            resolve(soccerGame.length > 0);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function foundOneSoccerGame({dateMatch: dateMatch, id: id}){
    if(dateMatch){
        return SoccerGame.findOne({dateMatch: dateMatch}).populate('team');
    }
    if(id){
        return SoccerGame.findById(id).populate('team')
    }
    throw new Error(
        "Funcion obtener un partido del controlador fue llamado sin especificar la fecha o el id"
    )
}

module.exports = {
    createSoccerGame,
    foundSoccerGame,
    foundOneSoccerGame,
    updateSoccerGame,
    deleteSoccerGame,
    existingSoccerGame
}