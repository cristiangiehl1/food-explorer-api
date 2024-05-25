const { Router } = require("express");
const multer = require("multer");


const DishesController = require("../controllers/DishesController");
const DishesImageController = require("../controllers/DishesImageController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const uploadConfig = require("../configs/upload")


const dishesRouters = Router();
const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();
const dishesImageController = new DishesImageController();

dishesRouters.use(ensureAuthenticated);

dishesRouters.post("/", dishesController.create);
dishesRouters.get("/", dishesController.index);
dishesRouters.delete("/:id", dishesController.delete);
dishesRouters.put("/:dishe_id", dishesController.update);
dishesRouters.get("/:dishe_id", dishesController.show);
dishesRouters.patch("/image/:dishe_id", ensureAuthenticated, upload.single("image"), dishesImageController.update);

module.exports = dishesRouters;