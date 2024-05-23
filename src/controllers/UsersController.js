const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");
const knex = require("../database/knex");


class UsersController {
    async create(request, response) {
        const { name, email, password, passwordConfirm } = request.body

        if(!name || !email || !password) {
            throw new AppError("Preencha os campos obrigatórios");
        }

        if( password !== passwordConfirm) {
            throw new AppError("As senhas devem ser iguais.")
        }

        const checkIfUserExists = await knex("users").where({ email }).first();

        if(checkIfUserExists) {
            throw new AppError("Esse e-mail já está em uso.")
        }

        const hashedPassword = await hash(password, 8)
        
        await knex("users").insert({
            name,
            email,
            password: hashedPassword
        })

        return response.status(201).json();
    };

    async update(request, response) {
        const { name, email, new_password, old_password } = request.body;
        const { id } = request.params;

        const user = await knex("users").where({ id }).first();

        if(!user) {
            throw new AppError("Usuário não encontrado.")
        };

        const emailAlreadyTaken = await knex("users").where({ email }).first();

        if(emailAlreadyTaken && emailAlreadyTaken.id !== user.id) {
            throw new AppError("Esse email já está em uso")
        };

        user.name  = name ?? user.name;
        user.email = email ?? user.email;

        if(new_password && !old_password) {
            throw new AppError("A senha antiga precisa ser informada.")
        };
    
        if (new_password && old_password) {

            const checkOldPassword = await compare(old_password, user.password)
            
            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere.")
            };

            const checkNewPassword = await compare(new_password, user.password)

            if (checkNewPassword) {
                throw new AppError("A senha nova deve ser diferente da antiga.")
            };

            user.password = await hash(new_password, 8);
        };

        await knex("users").where({ id }).update({
            name: user.name,
            email: user.email,
            password: user.password
        });
        
        return response.json(user);
    };  
}

module.exports = UsersController;