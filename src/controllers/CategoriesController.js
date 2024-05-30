const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const CATEGORIES_TYPES = require("../utils/CATEGORIES_TYPES");

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

    async show(request, response) {
        const dishe_id = request.params; 
        const categories = await knex("categories").where(dishe_id).first();

        return response.json(categories)
    }

    async update(request, response) {
        const { type, favorite, most_ordered } = request.body;
        const dishe_id = request.params;
        const categories = await knex("categories").where(dishe_id).first();

        const typeUpdated = type ?? categories.type;
        const favoriteUpdated = favorite ?? categories.favorite;
        const most_orderedUpdated = most_ordered ?? categories.most_ordered;

        if(type && !CATEGORIES_TYPES.includes(type)) {
                throw new AppError("Favor inserir uma categoria existente.")
        }

        await knex("categories").update({
            type: typeUpdated,
            favorite: favoriteUpdated,
            most_ordered: most_orderedUpdated
        }).where({ id: categories.id })        

        return response.json()
    }
} 

module.exports = CategoriesController;