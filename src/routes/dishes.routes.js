const { Router } = require("express");
const multer = require("multer");


const DishesController = require("../controllers/DishesController");
const DishesImageController = require("../controllers/DishesImageController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");


const uploadConfig = require("../configs/upload")


const dishesRouters = Router();
const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();
const dishesImageController = new DishesImageController();

dishesRouters.use(ensureAuthenticated);

dishesRouters.post("/", verifyUserAuthorization(["admin"]),dishesController.create);
dishesRouters.get("/", dishesController.index);
dishesRouters.delete("/:id", verifyUserAuthorization(["admin"]), dishesController.delete);
dishesRouters.put("/:dishe_id", verifyUserAuthorization(["admin"]), dishesController.update);
dishesRouters.get("/:dishe_id", dishesController.show);
dishesRouters.patch("/image/:dishe_id", verifyUserAuthorization(["admin"]), upload.single("image"), dishesImageController.update);

module.exports = dishesRouters;