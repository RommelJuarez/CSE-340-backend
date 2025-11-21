const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


Util.buildDetailView = async function (data) {
  let detailView=""

  if (data) {
    const vehicle = data
    const price2=new Intl.NumberFormat('en-US').format(vehicle.inv_price)
    const milesFormatted = vehicle.inv_miles.toLocaleString("en-US")

    detailView = `
      <div id="inv-detail-display" class="vehicle-detail">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        <div class="vehicle-info">
          <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <p><strong>Price:</strong> $${price2}</p>
          
          <p><strong>Mileage:</strong> ${milesFormatted} miles</p>
          <p><strong>Color:</strong> ${vehicle.inv_color}</p>
          <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        </div>
      </div>
    `
  } else {
    detailView = "<p>No vehicle data available.</p>"
    
  }

  return detailView
}

/* ****************************************
 * Build login form HTML
 * **************************************** */
Util.buildLoginForm = function () {
  return `
    <form action="/account/login" method="post" class="login-form">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        placeholder="Enter your email address"
      />

      <label for="password">Password</label>
      <div class="password-hint">
        Password must be at least 12 characters, with 1 uppercase letter, 1 number, and 1 special character.
      </div>
      <input
        type="password"
        id="password"
        name="password"
        required
        placeholder="Enter your password"
        pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$"
      />

      <button type="submit">Login</button>
    </form>

    <p class="register-link">
      No account?
      <a href="/account/register">Sign-up</a>
    </p>
  `;
};

/* ****************************************
 * Build registration form HTML
 * **************************************** */
Util.buildRegisterForm = function (req = {}) {
  const { first_name, last_name, email } = req.body || {};

  return `
    <form action="/account/register" method="post" class="register-form">
      <label for="first_name">First Name</label>
      <input type="text" id="first_name" name="first_name" required value="${first_name || ''}" />

      <label for="last_name">Last Name</label>
      <input type="text" id="last_name" name="last_name" required value="${last_name || ''}" />

      <label for="email">Email</label>
      <input type="email" id="email" name="email" required placeholder="Enter a valid email address" value="${email || ''}" />

      <label for="password">Password</label>
      <div class="password-hint">
        Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter, and 1 special character.
      </div>
      <input
        type="password"
        id="password"
        name="password"
        required
        pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$"
        placeholder="Create a strong password"
      />

      <button type="submit">Register</button>
    </form>
  `;
};



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
module.exports = Util