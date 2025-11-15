const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const errorProducer = {};
/* ***************************
 * THIS CODE PRODUCES AN ERROR FOR TESTING PURPOSES
 * ************************** */
errorProducer.errorProduce = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render("./inventory/classification2", {
            title: className + " vehicles",
            nav,
            grid,
        })
    } catch (error) {
        next(error);
    }

}
module.exports = errorProducer;