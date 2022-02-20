const Model = require('../models/usersModels')

async function createUser(userData) {
    return await Model.create(userData)
}

async function checkIfUsernameExists(username) {
    return await Model.find({ 'username': username })
}

async function checkIfEmailExists(email) {
    return await Model.find({ 'email': email })
}

async function getByUsername(username) {
    return await Model.find({ 'username': username })
}

async function getByEmail(email) {
    return await Model.find({ 'email': email })
}

async function getById(id) {
    return await Model.findById(id)
}

async function updateOne(userId, infoToUpdate) {
    return await Model.findByIdAndUpdate(userId, infoToUpdate)
}

module.exports = {
    createUser,
    checkIfUsernameExists,
    checkIfEmailExists,
    getByUsername,
    getByEmail,
    getById,
    updateOne,
}