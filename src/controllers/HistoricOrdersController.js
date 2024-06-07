const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class HistoricOrdersController {
    async create(request, response) {
        const { details } = request.body;
        const user_id = request.user.id;             

        const lastOrder = await knex("historic").orderBy("id", "desc").first();

        let code;

        if(lastOrder) {
            const lastCode = parseInt(lastOrder.code, 10);
            const nextCode = lastCode + 1;
            code = nextCode.toString().padStart(10, "0");
        } else {
            code = "0000000001";
        }

        const order = {
            code,
            details,
            user_id
        }

        await knex("historic").insert(order);

        return response.status(201).json(order);

    }

    async update(request, response) {
        const { status } = request.body;
        const { order_id } = request.params; 
        const user_role = request.user.role       

        if(user_role !== "admin") {
            throw new AppError("Somente o administrador tem permissão para alterar o status do pedido.")
        }

        const orderExists = await knex("historic").where({ id: order_id }).first();

        if(!orderExists) {
            throw new AppError("Esse pedido não está registrado no histórico")
        }

        orderExists.status = status;

        await knex("historic").update({
            status: orderExists.status,
            updated_at: knex.raw("DATETIME('now')")
        }).where({ id: order_id });

        return response.json(orderExists);


    }

    async index(request, response) {
        const user_id = request.user.id
        const user_role = request.user.role

        let historic;

        if(user_role === "customer") {
            historic = await knex("historic").where({ user_id }).orderBy("id", "desc");
        } else {
            historic = await knex("historic").orderBy("id", "desc");
        }

       return response.json(historic);

    }
}

module.exports = HistoricOrdersController;