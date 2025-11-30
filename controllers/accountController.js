const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const e = require("connect-flash");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt");

const accountController = {};

/* ****************************************
 *  Deliver login view
 * **************************************** */
accountController.buildLogin = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const loginForm = utilities.buildLoginForm();
    res.render("account/login", {
      title: "Login",
      nav,
      loginForm,
      message: req.flash("notice"),
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Deliver registration view
 * **************************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const registerForm = utilities.buildRegisterForm();
    res.render("account/register", {
      title: "Register",
      nav,
      registerForm,
      message: req.flash("notice"),
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
  try {

    
    
    let nav = await utilities.getNav()
    const reqBody = req.body
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(reqBody.password, saltRounds);
    const regResult = await accountModel.registerAccountModel(
      reqBody.first_name,
      reqBody.last_name,
      reqBody.email,
      hashedPassword
    )
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${reqBody.first_name}. Please log in.`
      )
      const loginForm = utilities.buildLoginForm();
      res.render("account/login", {
        title: "Login",
        nav,
        loginForm,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      const registerForm = utilities.buildRegisterForm();
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        registerForm,
        errors: null,

      })
    }
  } catch (error) {
    console.error('Error processing registration CONTROLLER: ', error.message)
    res.status(500).send("An error occurred during registration. Please try again later.")

  }
}
/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const loginBody = req.body
 
 
  const accountData = await accountModel.getAccountByEmail(loginBody.email)

 // Debugging line

  if (!accountData) {
    
    const loginForm = utilities.buildLoginForm();
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: loginBody.email,
      loginForm,
      message: req.flash("notice","Please check your credentials and try again."),
    })
    return
  }
  try {
    if (await bcrypt.compare(loginBody.password, accountData.account_password)) {
      console.log('Password match successful'); // Debugging line
      
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      
      return res.redirect("/account/");
    }
    else {
      console.log('Password mismatch',accountData.account_password,loginBody.password); // Debugging line
      const loginForm = utilities.buildLoginForm();
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        loginForm,
        errors: null,
        account_email: loginBody.email,
        message: req.flash("message notice", "Please check your credentials and try again Rommel .")
      })
    }
  } catch (error) {
    console.error('Error during account login CONTROLLER: ', error.message)
    throw new Error('Access Forbidden')
    
  }
}




accountController.buildAccountManagementViewTest = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const accountManagmentView = accountController.buildAccountManagementView();
    return res.render("account/success-login", {
      title: "Account Management",
      nav,
      accountManagmentView,
      
      errors: null,
    });
  } catch (error) {
    console.error('Error building account management view CONTROLLER: ', error.message)
    next(error)
  }
  

}
accountController.buildAccountManagementView = function () {
  return `

<p>You're logged in </p>
  `;
}

/* ****************************************
 *  Process account update
 * ************************************ */
accountController.updateAccount = async function (req, res,next) {
  try {
    let nav = await utilities.getNav();
    const { account_id, account_firstname, account_lastname, account_email } = req.body;

 
 
  
    const updatedAccount = await accountModel.updateAccountModel(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updatedAccount) {
      
      req.flash("notice", "Account information updated successfully.");
      const accountData = await accountModel.getAccountByID(account_id)
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Update failed. Please try again.");
      return res.redirect(`/account/update/`);
    } 
  } catch (error) {
    console.error("Error updating account:", error.message);
    next(error)
  }
};

/* ****************************************
 *  Process password update
 * ************************************ */
accountController.updatePassword = async function (req, res) {
  try {
    
    const { account_id, account_password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(account_password, saltRounds);

    const updated = await accountModel.updatePasswordModel(account_id, hashedPassword);

    if (updated) {
      req.flash("notice", "Password updated successfully.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Password update failed. Please try again.");
      return res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    console.error("Error updating password:", error.message);
    next(error)
  }
};

accountController.updateAccountView= async function (req,res,next) {
  try {
    let nav = await utilities.getNav();
    res.render("./account/update",{
      title: "Update Account Info",
      nav,
      message: req.flash("notice"),
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Logout Controller
 * *************************** */
accountController.logout = async function (req, res, next) {
  try {
    res.clearCookie("jwt");
    req.flash("notice", "You have been logged out successfully.");
    res.redirect("/"); 
  } catch (error) {
    console.error("Error during logout:", error.message);
    next(error);
  }
};

module.exports = accountController;