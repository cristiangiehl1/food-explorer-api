const knex = require("../database/knex")

class LastBuyHistoricController {
    async show(request, response) {
        const user_id = request.user.id

        const lastBuy = await knex("historic").where({ user_id }).orderBy("id", "desc").first();

        response.json(lastBuy);
    }
}

module.exports = LastBuyHistoricController;