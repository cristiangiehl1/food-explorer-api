const { Router } = require("express");



const IngredientsController = require("../controllers/IngredientsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");


const ingredientsRouters = Router();

const ingredientsController = new IngredientsController();


ingredientsRouters.use(ensureAuthenticated);

ingredientsRouters.get("/", ensureAuthenticated, verifyUserAuthorization(["admin"]), ingredientsController.index);


module.exports = ingredientsRouters;