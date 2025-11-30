const utilities = require(".")
const utilities1 = require("../utilities/")
const { body, validationResult } = require("express-validator")

const validate = {}

/* **********************************
 *  Account Update Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
  ]
}

/* ******************************
 * Check update account data
 * ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities1.getNav()
    res.render("account/update", {
      errors,
      title: "Update Account Information",
      nav,
      accountData: {
        account_id,
        account_firstname,
        account_lastname,
        account_email
      }
    })
    return
  }
  next()
}

/* **********************************
 *  Password Update Validation Rules
 * ********************************* */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check password update data
 * ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities1.getNav()
    res.render("account/update", {
      errors,
      title: "Update Account Information",
      nav,
      accountData: { account_id }
    })
    return
  }
  next()
}

module.exports = validate
