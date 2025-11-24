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

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const managementLinks = utilities.buildManagementView();
    res.render("./inventory/management", {
      title: "Management View",
      nav,
      managementLinks,
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Build  add classification view
 * ************************** */

invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classification = utilities.buildClassificationForm();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification,
      message: req.flash("notice"),
      errors: null,
    });

  } catch (error) {
    next(error);

  }
}

/* ***************************
 *  Build  add classification 
 * ************************** */
invCont.addClassification = async function (req, res) {
  try {
    let nav = await utilities.getNav()
    const reqBody = req.body
    console.log("Classification data CONTROLLER:", reqBody)

    const insertResult = await invModel.insertClassificationModel(
      reqBody.classification_name
    )

    console.log("Insert result CONTROLLER:", insertResult)

    if (insertResult && insertResult.rowCount > 0) {
      req.flash(
        "notice",
        `Classification "${reqBody.classification_name}" added successfully.`
      )
      let nav = await utilities.getNav()
      const classification = utilities.buildManagementView();
      
      res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        classification,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the classification could not be added.")
      const classification = utilities.buildManagementView();
      res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        classification,
        classification_name: reqBody.classification_name,
        errors: null,
      })
    }
  } catch (error) {
    console.error("Error processing classification CONTROLLER:", error.message)
    res.status(500).send("An error occurred while adding classification. Please try again later.")
  }
}


/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationList = await invModel.getClassifications()

    const addInventory = utilities.buildAddInventoryForm({}, classificationList)

    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      addInventory,
      message: req.flash("notice"),
      errors: null,
    })
    
  } catch (error) {
    next(error)
  }
}

invCont.addInventory = async function (req, res) {
  try {
    let nav = await utilities.getNav()
    const reqBody = req.body
    console.log("Inventory data CONTROLLER:", reqBody)

    const insertResult = await invModel.insertInventoryModel(
      reqBody.inv_make,
      reqBody.inv_model,
      reqBody.inv_year,
      reqBody.inv_description,
      reqBody.inv_image,
      reqBody.inv_thumbnail,
      reqBody.inv_price,
      reqBody.inv_miles,
      reqBody.inv_color,
      reqBody.classification_id
    )

    console.log("Insert result CONTROLLER:", insertResult)

    if (insertResult && insertResult.rowCount > 0) {
      req.flash(
        "notice",
        `Vehicle "${reqBody.inv_make} ${reqBody.inv_model}" added successfully.`
      )
      // Obtener la lista de clasificaciones actualizada
      const addInventory =  utilities.buildManagementView();
      
      res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        addInventory,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the vehicle could not be added.")
      // Obtener la lista de clasificaciones para volver a mostrar el formulario
  
      const addInventory =  utilities.buildManagementView();
      
      res.render("./inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        addInventory,
        errors: null,
      })
    }
  } catch (error) {
    console.error("Error processing inventory CONTROLLER:", error.message)
    res.status(500).send("An error occurred while adding the vehicle. Please try again later.")
  }
}


module.exports = invCont