const dependencies = require('../dependencies')
const response = require('../network/response')
const controller = require('../controllers/usersController')
const router = dependencies.use.express.Router()
const safeRoutes = require('../middlewares/safeRoutes')

router.post('/register', (req, res) => {
    controller.register(req.body, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'created', obj, 201)
    })
})

router.post('/login', (req, res) => {
    controller.login(req.body.user, req.body.password, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Logged in', obj)
    })
})

router.post('/updateInfo', safeRoutes, (req, res) => {
    controller.updatePersonalInfo(req.decoded.id, req.body, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Updated', obj)
    })
})

router.post('/forgotPassword', (req, res) => {
    controller.forgotPassword(req.body.email, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Ok', obj)
    })
})

router.post('/updatePassword', safeRoutes, (req, res) => {
    controller.updatePassword(req.body.id, req.body.newPassword, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Ok', obj)
    })
})

router.post('/addFavouritePokemon', safeRoutes, (req, res) => {
    controller.addFavouritePokemon(req.decoded.id, req.body, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Ok', obj)
    })
})

router.get('/favouritesListData', safeRoutes, (req, res) => {
    controller.getFavouriteListPokemonInfo(req.decoded.id, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Ok', obj)
    })
})

router.post('/deleteFromFavouritesList/', safeRoutes, (req, res) => {
    controller.deletePokemonFromFavouriteList(req.decoded.id, req.body.pokemon, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Ok', obj)
    })
})

router.post('/assignPet', safeRoutes, (req, res) => {
    controller.assignPet(req.decoded.id, req.body, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Ok', obj)
    })
})

router.post('/updatePet', safeRoutes, (req, res) => {
    controller.updatePet(req.decoded.id, req.body, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Ok', obj)
    })
})

router.get('/getPersonalInfo', safeRoutes, (req, res) => {
    controller.getPersonalInfo(req.decoded.id, function(obj) {
        obj.error ? response.error(req, res, obj.error, obj.status) : response.success(req, res, 'Ok', obj)
    })
})
module.exports = router