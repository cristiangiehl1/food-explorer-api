const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class DishesImageController {
    async update(request, response) {
        const user_id = request.user.id;
        const imageFilename = request.file.filename;
        const { dishe_id } = request.params;

        const diskStorage = new DiskStorage();

        const user = await knex("users").where({ id: user_id }).first();

        if(!user) {
            throw new AppError("Somente usuários autenticados podem mudar as imagens ilustrativas dos pratos.", 401);
        }

        const dishe = await knex("dishes").where({id: dishe_id}).first();

        if(!dishe) {
            throw new AppError("Somente pratos cadastrados no menu podem ter sua imagem alterada.")
        }

        const lasDotIndex = imageFilename.lastIndexOf(".");
        let imageExtension = '';

        console.log("Esse é o seu arquivo de imagem no backend => " + imageFilename);

        for (let i = lasDotIndex + 1; i < imageFilename.length; i++) {
            imageExtension += imageFilename[i];
        }

        console.log("Essa é a extensão do seu arquivo no backend =>" + imageExtension);

        if(imageExtension !== 'png' && imageExtension !== 'jpeg' && imageExtension !== 'jpg') {
            throw new AppError("O arquivo de imagem não é válido.");
        }

        if(dishe.image) {
            await diskStorage.disheDeleteFile(dishe.image);
        }

        const filename = await diskStorage.dishesSaveFile(imageFilename);

        dishe.image = filename;

        await knex("dishes").update(dishe).where({ id: dishe_id });

        return response.json(dishe);

    }
}

module.exports = DishesImageController;