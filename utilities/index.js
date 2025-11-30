const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
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
  let detailView = ""

  if (data) {
    const vehicle = data
    const price2 = new Intl.NumberFormat('en-US').format(vehicle.inv_price)
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
Util.buildLoginForm = function (req = {}) {
  const { account_email, account_password } = req.body || {};
  console.log('Building login form with:', account_email, account_password);
  return `
    <form action="/account/login" method="post" class="login-form">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        placeholder="Enter your email address"
        value="${account_email || ''}"
      />

      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        required
        placeholder="Enter your password"
        value="${account_password || ''}"
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
 * Build management view HTML
 * **************************************** */
Util.buildManagementView = function () {
  return `
    <ul id="management-view">
      <li>
        <a href="/inv/add-classification" title="Add Classification">Add New Classification</a>
      </li>
      <li>
        <a href="/inv/add-inventory" title="Add Inventory">Add New Vehicle</a>
      </li>
    </ul>
  `;
}
/* ****************************************
 * Build add classification form HTML
 * **************************************** */

Util.buildClassificationForm = function (req = {}) {
  const { classification_name } = req.body || {};

  return `
    <form action="/inv/add-classification" method="post" class="register-form">
      <label for="classification_name_input">Classification Name</label>
      <div class="password-hint">
        Classification names must not contain spaces or special characters. Only letters and numbers are allowed.
      </div>
      <input
        type="text"
        id="classification_name_input"
        name="classification_name"
        required
        pattern="^[A-Za-z0-9]+$"
        title="Only letters and numbers are allowed. No spaces or special characters."
        placeholder="Enter classification name"
        value="${classification_name || ''}"
      />

      <button type="submit">Add Classification</button>
    </form>
  `;
};
/* ****************************************
 * Build add inventory form HTML
 * **************************************** */
Util.buildAddInventoryForm = function (req = {}, classificationList = "") {
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
  } = req.body || {}


  let selectOptions = '<option value="">Choose a Classification</option>';

  if (classificationList && classificationList.rows) {
    classificationList.rows.forEach(item => {
      const selected = classification_id == item.classification_id ? 'selected' : '';
      selectOptions += `<option value="${item.classification_id}" ${selected}>${item.classification_name}</option>`;
    });
  }

  return `
    <form action="/inv/add-inventory" method="post" class="register-form">
      <label for="inv_make">Make</label>
      <input type="text" id="inv_make" name="inv_make" required value="${inv_make || ''}" placeholder="Enter vehicle make (e.g., Toyota, Ford)" />

      <label for="inv_model">Model</label>
      <input type="text" id="inv_model" name="inv_model" required value="${inv_model || ''}" placeholder="Enter vehicle model (e.g., Camry, F-150)" />

      <label for="inv_year">Year</label>
      <input type="number" id="inv_year" name="inv_year" required min="1900" max="2099" value="${inv_year || ''}" placeholder="Enter 4-digit year (e.g., 2024)" />

      <label for="inv_description">Description</label>
      <textarea id="inv_description" name="inv_description" required placeholder="Enter detailed vehicle description (min 3 characters)">${inv_description || ''}</textarea>

      <label for="inv_image">Image Path</label>
      <input type="text" id="inv_image" name="inv_image" required value="${inv_image || '/images/vehicles/no-image.png'}" placeholder="/images/vehicles/your-image.png" />

      <label for="inv_thumbnail">Thumbnail Path</label>
      <input type="text" id="inv_thumbnail" name="inv_thumbnail" required value="${inv_thumbnail || '/images/vehicles/no-image-tn.png'}" placeholder="/images/vehicles/your-thumbnail.png" />

      <label for="inv_price">Price</label>
      <input type="text" id="inv_price_display" name="inv_price_display" required value="${inv_price ? Number(inv_price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : ''}" placeholder="Enter price (e.g., 15,000 or 15,000.50)" />
      <input type="hidden" id="inv_price" name="inv_price" value="${inv_price || ''}" />

      <label for="inv_miles">Miles</label>
      <input type="number" id="inv_miles" name="inv_miles" required min="0" step="1" value="${inv_miles || ''}" placeholder="Enter mileage (e.g., 23456)" />

      <label for="inv_color">Color</label>
      <input type="text" id="inv_color" name="inv_color" required value="${inv_color || ''}" placeholder="Enter vehicle color (e.g., Red, Blue)" />

      <label for="classification_id">Classification</label>
      <div class="password-hint">Choose the classification this vehicle belongs to.</div>
      <select id="classification_id" name="classification_id" required>
        ${selectOptions}
      </select>

      <button type="submit">Add Vehicle</button>
    </form>

    <script>
      
      const priceDisplay = document.getElementById('inv_price_display');
      const priceHidden = document.getElementById('inv_price');
      
      priceDisplay.addEventListener('input', function(e) {
        
        let value = e.target.value.replace(/[^0-9.]/g, '');
        
        
        const parts = value.split('.');
        if (parts.length > 2) {
          value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        
        if (parts.length === 2 && parts[1].length > 2) {
          value = parts[0] + '.' + parts[1].substring(0, 2);
        }
        
        if (value !== '' && !isNaN(value)) {
          priceHidden.value = value;
          
          
          const numValue = parseFloat(value);
          const formatted = numValue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          });
          
          
          if (value.endsWith('.')) {
            e.target.value = formatted + '.';
          } else if (value.includes('.') && value.split('.')[1] === '') {
            e.target.value = formatted + '.';
          } else {
            e.target.value = formatted;
          }
        } else if (value === '') {
          priceHidden.value = '';
          e.target.value = '';
        }
      });

      priceDisplay.addEventListener('blur', function(e) {
        if (priceHidden.value !== '') {
          const numValue = parseFloat(priceHidden.value);
          e.target.value = numValue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          });
        }
      });
    </script>
  `
}
/* ****************************************
 * Build edit inventory form HTML
 * **************************************** */
Util.buildEditInventoryForm = function (req = {}, classificationList = "") {
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
  } = req.body || {}



  let selectOptions = '<option value="">Choose a Classification</option>';

  if (classificationList && classificationList.rows) {

    classificationList.rows.forEach(item => {
      const selected = classification_id == item.classification_id ? 'selected' : '';
      selectOptions += `<option value="${item.classification_id}" ${selected}>${item.classification_name}</option>`;
    });
  }

  return `
    <form action="/inv/edit-inventory" method="post" class="register-form" id="updateForm">
      <label for="inv_make">Make</label>
      <input type="text" id="inv_make" name="inv_make" required value="${inv_make || ''}" placeholder="Enter vehicle make (e.g., Toyota, Ford)" />

      <label for="inv_model">Model</label>
      <input type="text" id="inv_model" name="inv_model" required value="${inv_model || ''}" placeholder="Enter vehicle model (e.g., Camry, F-150)" />

      <label for="inv_year">Year</label>
      <input type="number" id="inv_year" name="inv_year" required min="1900" max="2099" value="${inv_year || ''}" placeholder="Enter 4-digit year (e.g., 2024)" />

      <label for="inv_description">Description</label>
      <textarea id="inv_description" name="inv_description" required placeholder="Enter detailed vehicle description (min 3 characters)">${inv_description || ''}</textarea>

      <label for="inv_image">Image Path</label>
      <input type="text" id="inv_image" name="inv_image" required value="${inv_image || '/images/vehicles/no-image.png'}" placeholder="/images/vehicles/your-image.png" />

      <label for="inv_thumbnail">Thumbnail Path</label>
      <input type="text" id="inv_thumbnail" name="inv_thumbnail" required value="${inv_thumbnail || '/images/vehicles/no-image-tn.png'}" placeholder="/images/vehicles/your-thumbnail.png" />

      <label for="inv_price">Price</label>
      <input type="text" id="inv_price_display" name="inv_price_display" required value="${inv_price ? Number(inv_price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : ''}" placeholder="Enter price (e.g., 15,000 or 15,000.50)" />
      <input type="hidden" id="inv_price" name="inv_price" value="${inv_price || ''}" />

      <label for="inv_miles">Miles</label>
      <input type="number" id="inv_miles" name="inv_miles" required min="0" step="1" value="${inv_miles || ''}" placeholder="Enter mileage (e.g., 23456)" />

      <label for="inv_color">Color</label>
      <input type="text" id="inv_color" name="inv_color" required value="${inv_color || ''}" placeholder="Enter vehicle color (e.g., Red, Blue)" />

      <label for="classification_id">Classification</label>
      <div class="password-hint">Choose the classification this vehicle belongs to.</div>
      <select id="classification_id" name="classification_id" required>
        ${selectOptions}
      </select>

      <button  type="submit" disabled>Update Vehicle</button>
      <input type="hidden" name="inv_id" value="${inv_id}"/>

    </form>
    
    <script>
      
      const priceDisplay = document.getElementById('inv_price_display');
      const priceHidden = document.getElementById('inv_price');
      
      priceDisplay.addEventListener('input', function(e) {
        
        let value = e.target.value.replace(/[^0-9.]/g, '');
        
        
        const parts = value.split('.');
        if (parts.length > 2) {
          value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        
        if (parts.length === 2 && parts[1].length > 2) {
          value = parts[0] + '.' + parts[1].substring(0, 2);
        }
        
        if (value !== '' && !isNaN(value)) {
          priceHidden.value = value;
          
          
          const numValue = parseFloat(value);
          const formatted = numValue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          });
          
          
          if (value.endsWith('.')) {
            e.target.value = formatted + '.';
          } else if (value.includes('.') && value.split('.')[1] === '') {
            e.target.value = formatted + '.';
          } else {
            e.target.value = formatted;
          }
        } else if (value === '') {
          priceHidden.value = '';
          e.target.value = '';
        }
      });

      priceDisplay.addEventListener('blur', function(e) {
        if (priceHidden.value !== '') {
          const numValue = parseFloat(priceHidden.value);
          e.target.value = numValue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          });
        }
      });
    </script>
  `
}

Util.buildClassificationSelect = function (req = {}, classificationList = "") {
  const { classification_id } = req.body || {};

  let selectOptions = '<option value="">Choose a Classification</option>';

  if (classificationList && classificationList.rows) {
    classificationList.rows.forEach(item => {
      const selected = classification_id == item.classification_id ? 'selected' : '';
      selectOptions += `<option value="${item.classification_id}" ${selected}>${item.classification_name}</option>`;
    });
  }

  return `
    <label for="classification_id">Classification</label>
    
    <select id="classification_id" name="classification_id" required>
      ${selectOptions}
    </select>
  `;
};





/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = true; 
        next();
      }
    );
  } else {
    res.locals.loggedin = false; 
    next();
  }
};


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}
/* ****************************************
 *  Check Account Type for Admin/Employee
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  
  if (res.locals.loggedin && res.locals.accountData) {
    const type = res.locals.accountData.account_type;

    if (type === "Employee" || type === "Admin") {
      
      return next();
    } else {
      
      req.flash("notice", "You do not have permission to access that view.");
      return res.redirect("/account/login");
    }
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util