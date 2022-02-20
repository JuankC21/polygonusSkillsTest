const dependencies = require('../dependencies')
const safeRoutes = dependencies.use.express.Router();
const response = require("../network/response");
const config = require("../config");

safeRoutes.use((req, res, next) => {
    const token = req.headers["access-token"];
    if (token) {
        dependencies.use.jsonwebtoken.verify(token, config.key, (err, decoded) => {
            if (err) {
                return response.error(req, res, { error: "Invalid token" }, 401);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        response.error(req, res, { error: "Token not provided" }, 401);
    }
});

module.exports = safeRoutes;