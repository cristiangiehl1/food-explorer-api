const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class FavoritesController {
    async create(request, response) {
        const user_id  = request.user.id
        const { dishe_id } = request.params;

        const favoriteAlreadyExists = await knex("favorites").where({ user_id, dishe_id }).first();

        if(favoriteAlreadyExists) {
            throw new AppError("Esse prato já tem a categoria favoritos.")
        }

        const disheExists = await knex("dishes").where({ id: dishe_id }).first();

        if(!disheExists) {
            throw new AppError("Esse prato não existe para você favoritar!");
        }

        await knex("favorites").insert({
            dishe_id,
            user_id            
        })

        return response.status(201).json();
    }

    async update(request, response) {
        const user_id  = request.user.id
        const { dishe_id } = request.params;
        const { favorite } = request.body; 
        

        const favoriteExists = await knex("favorites").where({ user_id, dishe_id }).first();

        if(!favoriteExists) {
            throw new AppError("Esse prato não está cadastrado nos favoritos.");
        }

        if(favorite !== 1 && favorite !== 0 && favorite !== true && favorite !== false) {
            throw new AppError("O valor de favorite deve ser booleano.")
        }
        

        await knex("favorites").update({
            favorite: favorite
        }).where({user_id, dishe_id });


        return response.json()
    }

    async index(request, response) {
        const user_id = request.user.id;

        const userFavorites = await knex("favorites").where({ user_id });

        return response.json(userFavorites)
    }

    async show(request, response) {
        const user_id  = request.user.id;
        const { dishe_id } = request.params;

        const userDisheFavorite = await knex("favorites").where({ user_id, dishe_id: dishe_id }).first();

        return response.json(userDisheFavorite)
    }

    
}

module.exports = FavoritesController;