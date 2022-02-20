const dependencies = require('../dependencies')
const response = require('../network/response')
const controller = require('../controllers/pokemonController')
const router = dependencies.use.express.Router()
const safeRoutes = require('../middlewares/safeRoutes')


router.get('/:dataType/:pokemon', safeRoutes, (req, res) => {
    controller.getPokemonInfo(req.params.dataType, req.params.pokemon, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Ok', obj)
    })
})

router.post('/manyPokemon', safeRoutes, (req, res) => {
    controller.getManyPokemonInfo(req.body.pokemon, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Ok', obj)
    })
})



module.exports = router