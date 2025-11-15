const express = require("express")
const router = new express.Router() 
const errorController = require("../controllers/errorController")
// Route to handle errors
router.get("/", errorController.errorProduce);

module.exports = router;