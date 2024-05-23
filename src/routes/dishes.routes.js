const { Router } = require("express");

const DishesController = require("../controllers/DishesController");

const dishesRouters = Router();

const dishesController = new DishesController();


dishesRouters.post("/:user_id", dishesController.create);
dishesRouters.get("/:id", dishesController.show);

module.exports = dishesRouters;