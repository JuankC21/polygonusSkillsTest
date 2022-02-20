const defaultEndpoints = require('../endpoints/defaultEndpoints')
const usersEndpoints = require('../endpoints/usersEndpoints')
const pokemonEndpoints = require('../endpoints/pokemonEndponts')

const routes = function(server) {
    server.use('/api', defaultEndpoints),
        server.use('/api/users', usersEndpoints),
        server.use('/api/pokemon', pokemonEndpoints)
};

module.exports = routes;