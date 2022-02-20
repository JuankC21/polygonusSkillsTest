const dependencies = require('../dependencies')
const router = dependencies.use.express.Router()

router.get('/', (req, res) => {
    res.send({
        'status': 200,
        'Message': 'Ok',
        'body': {
            'API - version': '1.0.0'
        }
    })
})


module.exports = router