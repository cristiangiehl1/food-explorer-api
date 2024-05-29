const { Router } = require("express");

const usersRouters = require("./users.routes")
const dishesRouters = require("./dishes.routes")
const sessionsRouters = require("./sessions.routes")
const ingredientsRouters = require("./ingredients.routes")


const routes = Router();

routes.use("/users", usersRouters);
routes.use("/sessions", sessionsRouters);
routes.use("/dishes", dishesRouters);
routes.use("/ingredients", ingredientsRouters);


module.exports = routes;
