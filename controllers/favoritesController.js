const favModel = require("../models/favorites-model")
const utilities = require("../utilities/")

const favoritesCont = {}

/* ============================
 * Add favorite
 * ============================ */
favoritesCont.addFavorite = async function(req, res, next) {
  try {
    const { inv_id } = req.body;
    const account_id = res.locals.accountData?.account_id;

    if (!account_id) {
      req.flash("notice", "You must be logged in to add favorites.")
      return res.redirect("/account/login");
    }

    await favModel.addFavorite(account_id, inv_id);

    req.flash("notice", "Vehicle added to your favorites!");
    res.redirect("back");

  } catch (error) {
    console.error("Error adding favorite:", error.message);
    next(error);
  }
};

/* ============================
 * View favorites
 * ============================ */
favoritesCont.buildFavorites = async function(req, res, next) {
  try {
    const account_id = res.locals.accountData?.account_id;

    if (!account_id) {
      return res.redirect("/account/login");
    }

    const nav = await utilities.getNav();
    const favorites = await favModel.getFavoritesByAccount(account_id);

    const favoritesView = utilities.buildFavoritesView(favorites);

    res.render("./inventory/favorites", {
      title: "My Favorites",
      nav,
      favoritesView,
      errors: null,
      message: req.flash("notice")
    });

  } catch (error) {
    console.error("Error loading favorites:", error.message);
    next(error);
  }
};

/* ============================
 * Delete favorite
 * ============================ */
favoritesCont.deleteFavorite = async function(req, res, next) {
  try {
    const { favorite_id } = req.body;
    const account_id = res.locals.accountData?.account_id;

    await favModel.deleteFavorite(favorite_id, account_id);

    req.flash("notice", "Favorite removed.");
    res.redirect("/favorites");

  } catch (error) {
    console.error("Error deleting favorite:", error.message);
    next(error);
  }
};

module.exports = favoritesCont;
