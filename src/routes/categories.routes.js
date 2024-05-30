const { Router } = require("express");

const CategoriesController = require("../controllers/CategoriesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const categoiresRouters = Router();

const categoriesController = new CategoriesController();

categoiresRouters.use(ensureAuthenticated);

categoiresRouters.get("/", categoriesController.index);
categoiresRouters.get("/:dishe_id", categoriesController.show);
categoiresRouters.put("/:dishe_id", categoriesController.update);


module.exports = categoiresRouters;