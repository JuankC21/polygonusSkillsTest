const dependencies = require("./dependencies")

dependencies.use.dotenv.config();

module.exports = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DBURL,
    key: process.env.KEY,
    mailSenderEmail: process.env.EMAIL,
    mailSenderPassword: process.env.EMAILPASSWORD
}