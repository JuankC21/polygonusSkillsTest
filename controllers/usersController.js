const dependencies = require('../dependencies')
const store = require('../store/usersStore')
const config = require('../config')
const mailSender = require('../plugins/mailSender')


async function register(userData, callback) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (specialChars.test(userData.username)) {
        callback({ error: 'Username can not contain special characters', status: 400 })
    } else {
        let usernameAlreadyExists = await store.checkIfUsernameExists(userData.username)
        let emailAlreadyExists = await store.checkIfEmailExists(userData.email)

        let newUser = {
            name: userData.name,
            lastname: userData.lastname,
            email: userData.email,
            username: userData.username,
            password: dependencies.use.bcryptjs.hashSync(userData.password, 10),
            factAboutMe: userData.factAboutMe,
            favouritePokemon: [],
            pet: {}
        }

        if (usernameAlreadyExists.length != 0 || emailAlreadyExists != 0) {
            callback({ error: 'An account with these credentials already exists, please check your username or your email', status: 409 })
        } else {
            store.createUser(newUser)
            callback(newUser)
        }
    }


}

async function login(user, password, callback) {
    let userData;

    if (user.includes('@')) {
        userData = await store.getByEmail(user)
    } else {
        userData = await store.getByUsername(user)
    }

    if (userData.length == 0) {
        callback({ error: 'This user does not exist', status: 404 })
    } else {
        userData = userData[0]
        dependencies.use.bcryptjs.compare(password, userData.password, function(err, data) {
            if (err) {
                callback({ error: err, status: 500 })
            } else {
                if (data) {
                    let accessToken = dependencies.use.jsonwebtoken.sign({ id: userData._id, email: userData.email, username: userData.username }, config.key, {
                        expiresIn: '30d'
                    });
                    callback({ accessToken: accessToken })
                } else {
                    callback({ error: 'Wrong password', status: 403 })
                }
            }
        })
    }
}

async function updatePersonalInfo(userId, infoToUpdate, callback) {
    await store.updateOne(userId, infoToUpdate)
    callback(infoToUpdate)

}

async function forgotPassword(email, callback) {
    let userData = await store.getByEmail(email)
    userData = userData[0]

    let accessToken = dependencies.use.jsonwebtoken.sign({ id: userData._id, email: userData.email, username: userData.username }, config.key, {
        expiresIn: '1 hour'
    });

    await mailSender.forgotPassword(email, userData.name, accessToken, function(obj) {
        if (obj.error) {
            callback({ error: obj.error, status: 500 })
        } else {
            callback({ success: true })
        }
    })
}

async function updatePassword(userId, newPassword, callback) {
    let updateData = { password: dependencies.use.bcryptjs.hashSync(newPassword) }
    await store.updateOne(userId, updateData)
    callback({ success: true })
}

async function addFavouritePokemon(userId, pokemonData, callback) {
    let userData = await store.getById(userId)
    if (userData.favouritePokemon.length == 0) {
        let newFavouritePokemon = {
            name: pokemonData.name,
            customName: pokemonData.customName
        }

        userData.favouritePokemon.push(newFavouritePokemon)
        callback(await store.updateOne(userId, userData))
    } else {

        let pokemonIsAlreadyInList = false

        for (let i = 0; i < userData.favouritePokemon.length; i++) {
            if (userData.favouritePokemon[i].name == pokemonData.name) {
                pokemonIsAlreadyInList = true
                callback({ error: 'This pokemon is already in your favourites list', status: 409 })
            }
        }

        if (!pokemonIsAlreadyInList) {
            let newFavouritePokemon = {
                name: pokemonData.name,
                customName: pokemonData.customName
            }

            userData.favouritePokemon.push(newFavouritePokemon)
            callback(await store.updateOne(userId, userData))
        }
    }

}


async function getFavouriteListPokemonInfo(userId, callback) {
    let userData = await store.getById(userId)

    if (userData.favouritePokemon.length == 0) {
        callback({ error: 'There is no pokemon in your favourites list', status: 404 })
    } else {
        let pokemonData = []
        for (let i = 0; i < userData.favouritePokemon.length; i++) {
            let currentPokemonData = await dependencies.use.axios.get(`https://pokeapi.co/api/v2/pokemon/${userData.favouritePokemon[i].name}`)
            pokemonData.push({ name: userData.favouritePokemon[i].name, customName: userData.favouritePokemon[i].customName, data: currentPokemonData.data })
        }

        callback({ data: pokemonData });
    }
}


async function deletePokemonFromFavouriteList(userId, pokemon, callback) {
    let userData = await store.getById(userId)

    if (userData.favouritePokemon.some(e => e.name == pokemon)) {
        let pokemonIndex = userData.favouritePokemon.findIndex(e => e.name == pokemon);

        userData.favouritePokemon.splice(pokemonIndex, 1)
        store.updateOne(userId, userData)

        callback({ success: true })
    } else {
        callback({ error: `${pokemon} is not into your favourites list`, status: 404 })
    }
}

async function assignPet(userId, petInfo, callback) {
    if (petInfo.hasOwnProperty('pokemon') && petInfo.hasOwnProperty('customName')) {
        let userData = await store.getById(userId)
        let newPet = {
            pokemon: petInfo.pokemon,
            customName: petInfo.customName
        }

        userData['pet'] = newPet
        callback(await store.updateOne(userId, userData))
    } else {
        callback({ error: 'Bad request', status: 400 })
    }
}

async function updatePet(userId, petInfo, callback) {
    let userData = await store.getById(userId)

    if (userData.pet) {

        if (petInfo.hasOwnProperty('pokemon') && petInfo.hasOwnProperty('customName')) {
            let newPet = { pokemon: petInfo.pokemon, customName: petInfo.customName }

            userData.pet = newPet
            store.updateOne(userId, userData)
            callback({ success: true })

        } else if (petInfo.hasOwnProperty('customName') && !petInfo.hasOwnProperty('pokemon')) {
            userData.pet.customName = petInfo.customName
            store.updateOne(userId, userData)
            callback({ success: true })
        } else {
            callback({ error: 'Bad request', status: 400 })
        }
    } else {
        callback({ error: 'You dont have a pet', status: 404 })
    }

}

async function getPersonalInfo(userId, callback) {
    callback(await store.getById(userId))
}

module.exports = {
    register,
    login,
    updatePersonalInfo,
    forgotPassword,
    updatePassword,
    addFavouritePokemon,
    getFavouriteListPokemonInfo,
    deletePokemonFromFavouriteList,
    assignPet,
    updatePet,
    getPersonalInfo
}