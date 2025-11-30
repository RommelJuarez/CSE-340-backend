const utilities = require(".")
const utilities1 = require("../utilities/")
const { body, validationResult } = require("express-validator")

const validate = {}

/* **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email address."),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please enter your password."),
  ]
}

/* ******************************
 * Check login data and return errors or continue
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { email } = req.body || {}
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const loginForm = utilities1.buildLoginForm(req)
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      email,
      loginForm,
    })
    return
  }
  next()
}

module.exports = validate

