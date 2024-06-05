const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishesController {
    async create(request, response) {
       const { name, description, price, ingredients, categories, most_ordered } = request.body;

       const user_id  = request.user.id;

       const checkIfUserExists = await knex("users").where({id: user_id}).first();
       
       if(!checkIfUserExists) {
        throw new AppError("Usuário não encontrado.")
       }

       const disheAlredyExist = await knex("dishes").where("name", "like", `%${name}%`);

       if(disheAlredyExist.length !== 0) {
        throw new AppError("Esse prato já foi registrado no sistema.")
       }

       if(price) {
            let priceIsNum = true;           

            for(let i = 0; i < price.length; i++) {                
                if(price[i] !== '.' && price[i] !== ',' && isNaN(parseFloat(price[i]))) {          
                    priceIsNum = false;
                    break                    
                }
            }            
            if(!priceIsNum) {
                throw new AppError("Informar um valor válido para o preço do prato")
            }
        }

        const priceFloat = parseFloat(price)
        const priceFormated = priceFloat.toFixed(2).replace(',', '.');

        const [dishe_id] = await knex("dishes").insert({
            name,
            description,
            price: priceFormated,
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

       const categoriesInsert = {
            dishe_id,
            user_id,
            type: categories,
            most_ordered: most_ordered ?? false
       }


       await knex("categories").insert(categoriesInsert);

       return response.status(201).json(dishe_id);
    };

    async show(request, response) {
        const { dishe_id } = request.params;      
 
        const dishe = await knex("dishes").where({ id: dishe_id }).first();
    
        if(!dishe) {
            throw new AppError("Você não possui esse prato cadastrado no menu.")
        }

        const ingredients = await knex("ingredients")
            .where({dishe_id: dishe_id})
            .orderBy("ingredient")

        const categories = await knex("categories")
        .where({dishe_id: dishe_id})
        .orderBy("type")

        return response.json({
            ...dishe,
            ingredients,
            categories
        });
    };

    async index(request, response) {
        const { name, ingredients } = request.query;
        // const user_id  = request.user.id;

        let dishes;

        if(ingredients) {
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

            dishes = await knex("ingredients")
                .select([
                    "dishes.id",
                    "dishes.name",
                    // "dishes.user_id"
                ])
                // .where("dishes.user_id", user_id)
                .whereLike("dishes.name", `%${name}%`)
                .whereIn("ingredient", filterIngredients)
                .innerJoin("dishes", "dishes.id", "ingredients.dishe_id")
                .groupBy("dishes.id")
                .orderBy("dishes.name");
        } else {
            dishes = await knex("dishes")
                // .where({ user_id })
                .whereLike("name", `%${name}%`)
                .orderBy("name");
        }

        console.log(dishes);

        // const userIngredients = await knex("ingredients").where({user_id});
        const userIngredients = await knex("ingredients");

                
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
        const { id } = request.params;

        await knex("dishes").where({ id }).delete();

        return response.json();

    }

    async update(request, response) {
        const { dishe_id } = request.params;
        const { name, price, description, ingredients, categories, most_ordered } = request.body;
        

        const dishe = await knex("dishes").where({ id: dishe_id }).first();

        if(!dishe) {
            throw new AppError("Esse prato não foi encontrado no menu do restaurante.")
        }

        
        if(price) {
            let priceIsNum = true;           

            for(let i = 0; i < price.length; i++) {                
                if(price[i] !== '.' && isNaN(parseFloat(price[i]))) {          
                    priceIsNum = false;
                    break                    
                }
            }            
            if(!priceIsNum) {
                throw new AppError("Informa um valor válido para o preço prato")
            }
        }

        const priceToNum = parseFloat(price);
        const priceFormated = priceToNum.toFixed(2);
        console.log(priceFormated);

        dishe.name = name ?? dishe.name;
        dishe.price = priceFormated ?? dishe.price;
        dishe.description = description ?? dishe.description; 
        dishe.image = dishe.image; 
                
        await knex("dishes").update({
            name: dishe.name,
            price: dishe.price,
            description: dishe.description
        }).where({ id: dishe_id })

        
        if(ingredients) {
            await knex("ingredients").where({dishe_id: dishe.id}).delete();

            const ingredientsInsert = ingredients.map(ingredient => {
                return {
                    dishe_id: dishe.id,
                    user_id: dishe.user_id,
                    ingredient
                }
            });

            await knex("ingredients").insert(ingredientsInsert);
        }    

        if(categories) {
            const fetchCategory = await knex("categories").where({dishe_id: dishe.id}).first();

            await knex("categories").update({
                dishe_id: dishe.id,
                user_id: dishe.user_id,
                type: categories,
                favorite: fetchCategory.favorite,
                most_ordered: most_ordered ?? fetchCategory.most_ordered
            }).where({ id: fetchCategory.id })             
        }


        return response.json();
    }
}

module.exports = DishesController;