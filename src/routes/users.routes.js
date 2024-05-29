const { Router } = require("express");
const multer = require("multer");

const UsersController = require("../controllers/UsersController");
const UsersAvatarController = require("../controllers/UsersAvatarController");
const UsersValidatedController = require("../controllers/UsersValidatedController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const uploadConfig = require("../configs/upload")

const usersRouters = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();
const usersValidatedController = new UsersValidatedController();

usersRouters.post("/", usersController.create);
usersRouters.put("/", ensureAuthenticated, usersController.update);
usersRouters.patch("/avatar", ensureAuthenticated, upload.single("avatar"), usersAvatarController.update);
usersRouters.get("/validated", ensureAuthenticated, usersValidatedController.index);


module.exports = usersRouters;
