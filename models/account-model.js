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
module.exports = {registerAccountModel}