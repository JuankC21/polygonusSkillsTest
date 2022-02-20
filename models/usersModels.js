const dependencies = require('../dependencies');
const Schema = dependencies.use.mongoose.Schema;

const mySchema = new Schema({
    name: String,
    lastname: String,
    email: String,
    username: String,
    password: String,
    factAboutMe: String,
    favouritePokemon: Array,
    pet: Object
})

module.exports = dependencies.use.mongoose.model("users", mySchema);