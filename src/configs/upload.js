const path = require("path");
const multer = require("multer");
const crypto = require("crypto");


const TEMP_FOLDER = path.resolve(__dirname, "..", "..", "temp");
const AVATAR_UPLOADS_FOLDER = path.resolve(TEMP_FOLDER, "uploads", "avatar");
const DISHES_UPLOADS_FOLDER = path.resolve(TEMP_FOLDER, "uploads", "dishes");

const MULTER = {
    storage: multer.diskStorage({
        destination: TEMP_FOLDER,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString("hex");
            const fileName = `${fileHash}-${file.originalname}`;

            return  callback(null, fileName);
        },
    }),
};

module.exports = {
    TEMP_FOLDER,
    AVATAR_UPLOADS_FOLDER,
    DISHES_UPLOADS_FOLDER,
    MULTER,
}