const dependencies = require('../dependencies')


async function getPokemonInfo(dataType, pokemon, callback) {
    if (dataType != 'types' && dataType != 'abilities') {
        callback({ 'error': `Data type '${dataType}' is not supported`, status: 400 })
    } else {
        dependencies.use.axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
            .then((res) => {
                if (dataType == 'types') {
                    callback({ 'types': res.data.types })
                } else if (dataType == 'abilities') {
                    callback({ 'abilities': res.data.abilities })
                }
            })
            .catch(function(error) {
                if (error) {
                    callback({ error: error.message, status: error.response.status })
                }
            })
    }
}

async function getManyPokemonInfo(pokemon, callback) {
    let pokemonInfo = []

    for (i = 0; i < pokemon.length; i++) {
        let notFound = false
        let pokemonData = await dependencies.use.axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon[i]}`).catch(err => notFound = true)

        notFound ? pokemonInfo.push({ name: pokemon[i], error: 'Data not found' }) : pokemonInfo.push({ name: pokemon[i], abilities: pokemonData.data.abilities, types: pokemonData.data.types })
    }
    callback({ pokemonInfo: pokemonInfo })
    console.log(pokemonInfo)
}


module.exports = {
    getPokemonInfo,
    getManyPokemonInfo
}