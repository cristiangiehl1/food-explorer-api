const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const favoritesRouters = Router();

const favoritesController = new FavoritesController();

favoritesRouters.use(ensureAuthenticated);

favoritesRouters.get("/", favoritesController.index);
favoritesRouters.post("/:dishe_id", favoritesController.create);
favoritesRouters.put("/:dishe_id", favoritesController.update);
favoritesRouters.get("/:dishe_id", favoritesController.show);




module.exports = favoritesRouters;