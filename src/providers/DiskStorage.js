const fs = require("fs");
const path = require("path");

const uploadConfig = require("../configs/upload");

class diskStorage {
    async avatarSaveFile(file) {
        await fs.promises.rename(
            path.resolve(uploadConfig.TEMP_FOLDER, file),
            path.resolve(uploadConfig.AVATAR_UPLOADS_FOLDER, file)
        )

        return file;
    };

    async dishesSaveFile(file) {
        await fs.promises.rename(
            path.resolve(uploadConfig.TEMP_FOLDER, file),
            path.resolve(uploadConfig.DISHES_UPLOADS_FOLDER, file)
        )

        return file;
    };


    async avatarDeleteFile(file) {
        const filePath = path.resolve(uploadConfig.AVATAR_UPLOADS_FOLDER, file);

        try {
            await fs.promises.stat(filePath);

        } catch {
            return;
        }

        await fs.promises.unlink(filePath);
    };

    async disheDeleteFile(file) {
        const filePath = path.resolve(uploadConfig.DISHES_UPLOADS_FOLDER, file);

        try {
            await fs.promises.stat(filePath);

        } catch {
            return;
        }

        await fs.promises.unlink(filePath);
    };
}

module.exports = diskStorage;