const express = require("express")
const router = new express.Router()
const favoritesController = require("../controllers/favoritesController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation") // si deseas validación express-validator

router.post("/add",
  utilities.checkLogin,
  favoritesController.addFavorite
)

router.get("/",
  utilities.checkLogin,
  favoritesController.buildFavorites
)

router.post("/delete",
  utilities.checkLogin,
  favoritesController.deleteFavorite
)

module.exports = router
