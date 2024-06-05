const { Router } = require("express");

const usersRouters = require("./users.routes")
const dishesRouters = require("./dishes.routes")
const sessionsRouters = require("./sessions.routes")
const ingredientsRouters = require("./ingredients.routes")
const categoiresRouters = require("./categories.routes")
const favoritesRouters = require("./favorites.routes")
const historicRouters = require("./historic.routes")


const routes = Router();

routes.use("/users", usersRouters);
routes.use("/sessions", sessionsRouters);
routes.use("/dishes", dishesRouters);
routes.use("/ingredients", ingredientsRouters);
routes.use("/categories", categoiresRouters);
routes.use("/favorites", favoritesRouters);
routes.use("/historic", historicRouters);


module.exports = routes;
