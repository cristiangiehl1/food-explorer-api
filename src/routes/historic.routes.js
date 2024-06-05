const { Router } = require("express");

const HistoricOrdersController = require("../controllers/HistoricOrdersController");
const LastBuyHistoricController = require("../controllers/LastBuyHistoricController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const historicOrdersRouters = Router();

const historicOrdersController = new HistoricOrdersController();
const lastBuyHistoricController = new LastBuyHistoricController();

historicOrdersRouters.use(ensureAuthenticated);

historicOrdersRouters.get("/", historicOrdersController.index);
historicOrdersRouters.get("/latest", lastBuyHistoricController.show);
historicOrdersRouters.post("/", historicOrdersController.create);
historicOrdersRouters.patch("/:order_id", historicOrdersController.update);

module.exports = historicOrdersRouters;