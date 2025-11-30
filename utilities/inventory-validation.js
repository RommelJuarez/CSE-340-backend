const utilities = require(".")
const utilities1 = require("../utilities/")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")

const validate = {}

/* **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be alphanumeric (no spaces or special characters)
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name must contain only letters and numbers, no spaces or special characters."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classification = utilities1.buildClassificationForm(req)
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
      classification,
    })
    return
  }
  next()
}

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // Make is required, min 3 characters
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required.")
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),

    // Model is required, min 3 characters
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required.")
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long."),

    // Year is required, must be 4 digits between 1900 and 2099
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be between 1900 and 2099.")
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be a 4-digit number."),

    // Description is required, min 3 characters
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required.")
      .isLength({ min: 3 })
      .withMessage("Description must be at least 3 characters long."),

    // Image path is required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required.")
      .matches(/^\/images\/vehicles\/.*\.(png|jpg|jpeg|gif|webp)$/i)
      .withMessage("Image path must be a valid path (e.g., /images/vehicles/image.png)."),

    // Thumbnail path is required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required.")
      .matches(/^\/images\/vehicles\/.*\.(png|jpg|jpeg|gif|webp)$/i)
      .withMessage("Thumbnail path must be a valid path (e.g., /images/vehicles/thumb.png)."),

    // Price is required, must be decimal or integer
    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required.")
      .custom((value) => {
        // Remover comas si existen
        const cleanValue = value.replace(/,/g, '')
        if (isNaN(cleanValue) || parseFloat(cleanValue) < 0) {
          throw new Error("Price must be a valid positive number.")
        }
        return true
      }),

    // Miles is required, digits only (integer)
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Miles is required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be a valid positive integer (digits only)."),

    // Color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required.")
      .isLength({ min: 1 })
      .withMessage("Color must have at least 1 character.")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Color must contain only letters."),

    // Classification is required
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification is required.")
      .isInt({ min: 1 })
      .withMessage("Please select a valid classification."),
  ]
}

/* ******************************
 * Check inventory data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  // Limpiar el precio de comas antes de validar
  if (req.body.inv_price) {
    req.body.inv_price = req.body.inv_price.replace(/,/g, '')
  }

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await invModel.getClassifications()
    const addInventory = utilities1.buildAddInventoryForm(req, classificationList)
    
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      addInventory,
    })
    return
  }
  next()
}
/* ******************************
 * Check inventory edit data and return errors or continue to add inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  
  if (req.body.inv_price) {
    req.body.inv_price = req.body.inv_price.replace(/,/g, '')
  }

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    const inventory_id = req.params.inventoryId
        const nav = await utilities.getNav()
        const classificationList = await invModel.getClassifications()
        const inventoryData = await invModel.getInventoryById(inventory_id)
    
        const editInventory = utilities.buildEditInventoryForm({body:inventoryData}, classificationList)
        const itemName = `${inventoryData.inv_make} ${inventoryData.inv_model}`
        res.render("./inventory/edit-inventory", {
          title: "Edit " + itemName,
          nav,
          editInventory,
          message: req.flash("notice"),
          errors: null,
          inv_id: inventoryData.inv_id,
          inv_make: inventoryData.inv_make,
          inv_model: inventoryData.inv_model,
          inv_year: inventoryData.inv_year,
          inv_description: inventoryData.inv_description,
          inv_image: inventoryData.inv_image,
          inv_thumbnail: inventoryData.inv_thumbnail,
          inv_price: inventoryData.inv_price,
          inv_miles: inventoryData.inv_miles,
          inv_color: inventoryData.inv_color,
          classification_id: inventoryData.classification_id
        })
    return
  }
  next()
}

module.exports = validate