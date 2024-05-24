const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishesController {
    async create(request, response) {
       const { name, description, price, ingredients } = request.body;

       const { user_id } = request.params;

       const priceIsNum = parseFloat(price);

       if (isNaN(priceIsNum)) {
           throw new AppError("O preço deve ser um número válido.");
       }

       const checkIfUserExists = await knex("users").where({id: user_id}).first();
       

       if(!checkIfUserExists) {
        throw new AppError("Usuário não encontrado.")
       }

       const disheAlredyExist = await knex("dishes").where("name", "like", `%${name}%`);


       if(disheAlredyExist.length !== 0) {
        throw new AppError("Esse prato já foi registrado no sistema.")
       }


       const [dishe_id] = await knex("dishes").insert({
        name,
        description,
        price,
        user_id
       });

       const ingredientsInsert = ingredients.map(ingredient => {
        return {
            dishe_id,
            user_id,
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
    };

    async index(request, response) {
        const { name, ingredients } = request.query;
        const { user_id } = request.params;

        let dishes;

        if(ingredients) {
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

            dishes = await knex("ingredients")
                .select([
                    "dishes.id",
                    "dishes.name",
                    "dishes.user_id"
                ])
                .where("dishes.user_id", user_id)
                .whereLike("dishes.name", `%${name}%`)
                .whereIn("ingredient", filterIngredients)
                .innerJoin("dishes", "dishes.id", "ingredients.dishe_id")
                .groupBy("dishes.id")
                .orderBy("dishes.name");
        } else {
            dishes = await knex("dishes")
                .where({ user_id })
                .whereLike("name", `%${name}%`)
                .orderBy("name");
        }

        const userIngredients = await knex("ingredients").where({user_id});
                
        const dishesWithIngredients = dishes.map(dishe => {
            const disheIngredients = userIngredients.filter(ingredient => ingredient.dishe_id === dishe.id) 

            return {
                ...dishe,
                ingredients: disheIngredients
            }
        })

        return response.json(dishesWithIngredients);
    }

    async delete(request, response) {

    }

    async update(request, resposne) {

    }







}

module.exports = DishesController;