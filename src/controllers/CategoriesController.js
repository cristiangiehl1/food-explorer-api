const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CategoriesController {
    async index(request, response) {        
        const categories = await knex("categories")            
            .orderBy("type")

        const dishes = await knex("dishes")
            .orderBy("name")

        const dishesWithCategories = dishes.map(dishe => {
            const disheCategories = categories.filter(category => category.dishe_id === dishe.id) 

            return {
                ...dishe,
                categories: disheCategories
            }
        })

        return response.json(dishesWithCategories);    
    }
} 

module.exports = CategoriesController;