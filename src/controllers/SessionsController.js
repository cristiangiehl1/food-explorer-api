const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const authConfig = require("../configs/auth")
const { sign } = require("jsonwebtoken")

const { compare } = require("bcryptjs");

class SessionsController {
    async create(request, response) {
        const { email, password } = request.body;

        const user = await knex("users").where({email}).first();

        if(!user) {
            throw new AppError("E-mail e/ou senha incorretos.", 401);
        }

        const passwordIsValid = await compare(password, user.password);

        if(!passwordIsValid) {
            throw new AppError("E-mail e/ou senha incorretos.", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({role: user.role}, secret, {
            subject: String(user.id),
            expiresIn
        });

        response.cookie("token", token, {
            httpOnly: true,
            sameSite: "None", 
            secure: true,
            maxAge: 60 * 60 * 1000        
        });

        delete user.password;

        return response.json({ user });

    };
}

module.exports = SessionsController;