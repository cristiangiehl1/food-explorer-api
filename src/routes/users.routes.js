const { Router } = require("express");
const multer = require("multer");

const UsersController = require("../controllers/UsersController");
const UsersAvatarController = require("../controllers/UsersAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const uploadConfig = require("../configs/upload")

const usersRouters = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

usersRouters.post("/", usersController.create);
usersRouters.put("/", ensureAuthenticated, usersController.update);
usersRouters.patch("/avatar", ensureAuthenticated, upload.single("avatar"), usersAvatarController.update);


module.exports = usersRouters;
