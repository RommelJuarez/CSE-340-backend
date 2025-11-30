const pool = require("../database/")


/* *****************************
*   Register new account
* *************************** */
async function registerAccountModel(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    console.log('Registering account with SQL: ', sql)
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    console.error('Error registering account: ', error.message)
    
    return error.message

  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM public.account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
/* *****************************
* Return account data using id
* ***************************** */
async function getAccountByID (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM public.account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
/* *****************************
*   Update account information
* *************************** */
async function updateAccountModel(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE public.account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `;
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating account info:", error.message);
    throw error;
  }
}

/* *****************************
*   Update account password
* *************************** */
async function updatePasswordModel(account_id, account_password) {
  try {
    const sql = `
      UPDATE public.account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING account_id
    `;
    const result = await pool.query(sql, [account_password, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating account password:", error.message);
    throw error;
  }
}
module.exports = {registerAccountModel, getAccountByEmail,updatePasswordModel,updateAccountModel,getAccountByID}