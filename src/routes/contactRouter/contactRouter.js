const contactRouter = require("express").Router();
const contactController = require("../../controllers/contactController");

contactRouter.post("/addContact/:userId", contactController.addContact);

module.exports = contactRouter;
