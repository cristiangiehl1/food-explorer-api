const knex = require("../database/knex")

class DishesController {
    async create(request, response) {
       const { name, description, ingredients } = request.body;

       const { user_id } = request.params;

       const [dishe_id] = await knex("dishes").insert({
        name,
        description,
        user_id
       });

       const ingredientsInsert = ingredients.map(ingredient => {
        return {
            dishe_id,
            ingredient
        }
       });

       await knex("ingredients").insert(ingredientsInsert);

       return response.json();
    };


    async show(request, response) {
        const { id } = request.params;

        const dishe = await knex("dishes").where({id}).first();

        const ingredients = await knex("ingredients")
            .where({dishe_id: id})
            .orderBy("ingredient")

        return response.json({
            ...dishe,
            ingredients
        });
    }







}

module.exports = DishesController;