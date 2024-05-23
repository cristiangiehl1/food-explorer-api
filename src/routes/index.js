const { Router } = require("express");

const usersRouters = require("./users.routes")
const dishesRouters = require("./dishes.routes")


const routes = Router();

routes.use("/users", usersRouters);
routes.use("/dishes", dishesRouters);


module.exports = routes;
