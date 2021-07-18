const AWS = require('aws-sdk')
const config = require('../../config')

const s3Client = new AWS.S3({ 
    ...config.s3
 })

 function saveImageUser(imageData, nameFile){
     return s3Client.putObject({
         Body: imageData,
         Bucket: 'data-image-sports-tournament',
         Key: `images-users/${nameFile}`
     }).promise()
 }

 function saveImageTeam(imageData, nameFile){
     return s3Client.putObject({
         Body: imageData,
         Bucket: 'data-image-sports-tournament',
         Key: `images-teams/${nameFile}`
     }).promise()
 }

 module.exports = {
     saveImageUser,
     saveImageTeam
 }