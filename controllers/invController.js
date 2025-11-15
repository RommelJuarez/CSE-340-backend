const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  }
  catch (error) {
    next(error);
  }


}
/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryById(inventory_id)
    const detailView = await utilities.buildDetailView(data)
    let nav = await utilities.getNav()
    console.log(data)
    res.render("./inventory/inventory-detail", {
      title: data.inv_make + " " + data.inv_model,
      nav,
      detailView,
    })
  }
  catch (error) {
    next(error);
  }


}



module.exports = invCont