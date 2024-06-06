require("express-async-errors");
require("dotenv/config");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const database = require("./database/sqlite")

const routes = require("./routes/");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload")

database();

const app = express();


app.use(cors({
    origin: ["http://localhost:5174", "http://127.0.0.1:517"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/files/dishes", express.static(uploadConfig.DISHES_UPLOADS_FOLDER));
app.use("/files/avatar", express.static(uploadConfig.AVATAR_UPLOADS_FOLDER));
app.use(routes);


app.use(( error, request, response, next ) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    console.error(error);
    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    });
});

const PORT = process.env.SERVER_PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});