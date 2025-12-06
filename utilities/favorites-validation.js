const { body } = require("express-validator")
const validate = {}

validate.favoriteRules = () => {
  return [
    body("inv_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Invalid vehicle selected.")
  ]
}

validate.checkData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("notice", "Invalid data submitted.")
    return res.redirect("back")
  }
  next()
}

module.exports = validate
