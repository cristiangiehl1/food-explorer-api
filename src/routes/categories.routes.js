const { Router } = require("express");

const CategoriesController = require("../controllers/CategoriesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const categoiresRouters = Router();

const categoriesController = new CategoriesController();


categoiresRouters.get("/", ensureAuthenticated, categoriesController.index);


module.exports = categoiresRouters;