const dependencies = require('./dependencies')
const config = require('./config')
const router = require('./network/routes')

var app = dependencies.use.express()

app.use(dependencies.use.cors({ origin: '*', credentials: true, allowedHeaders: '*' }))
app.use(dependencies.use.express.json())
app.use(dependencies.use.express.urlencoded({ extended: false }))

router(app)
app.listen(config.port)
console.log(`App ready in port ${config.port}`)

dependencies.use.mongoose.connect(config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("The database is ready and connected");
    })
    .catch((e) => {
        console.log("There was an error connecting to the database:" + e);
    });