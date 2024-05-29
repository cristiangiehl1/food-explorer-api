const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class IngredientsController {
   
    async index(request, response) {
        const { ingredient } = request.query;  
        
        const ingredients = await knex("ingredients").whereLike("ingredient", `%${ingredient}%`);
        const dishes = await knex("dishes");


        const disheFiltered = dishes.filter(dishe => {
            // Verifica se a dish contém pelo menos um dos ingredientes encontrados
            return ingredients.some(ingredient => dishe.id === ingredient.dishe_id);           })
    

        return response.json(disheFiltered);
    }
}

module.exports = IngredientsController;