const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
/* ***************************
 *  Get details for a specific inventory item by inventory_id
 * ************************** */

async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inventory_id]
    )
    console.log("Inventory data retrieved:", data.rows[0]); 
    return data.rows[0]

  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}


/* *****************************
*   Insert new classification
* *************************** */
async function insertClassificationModel(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    console.log("Inserting classification with SQL:", sql)
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("Error inserting classification:", error.message)
    return error.message
  }
}


/* *****************************
 *  Insert new inventory item
 * *************************** */
async function insertInventoryModel(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *
    `
    
    return await pool.query(sql, [
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
    ])
  } catch (error) {
    console.error("Error inserting inventory:", error.message)
    return error.message
  }
}

/* *****************************
 *  Update inventory item by ID
 * *************************** */
async function updateInventoryModel(
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
  classification_id
) {
  try {
    const sql = `
      UPDATE public.inventory
      SET
        inv_make = $1,
        inv_model = $2,
        inv_year = $3,
        inv_description = $4,
        inv_image = $5,
        inv_thumbnail = $6,
        inv_price = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
      WHERE inv_id = $11
      RETURNING *
    `;
    console.log("Updating inventory with SQL:", sql);
    return await pool.query(sql, [
      
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
      inv_id,
      
    ]);
  } catch (error) {
    console.error("Error updating inventory from model:", error.message);
    return error.message;
  }
}

/* *****************************
 *  Delete inventory item by ID
 * *************************** */
async function deleteInventoryModel(inv_id) {
  try {
    const sql = `
      DELETE FROM public.inventory
      WHERE inv_id = $1
      RETURNING *
    `;
    
    return await pool.query(sql, [inv_id]);
  } catch (error) {
    console.error("Error deleting inventory:", error.message);
    return error.message;
  }
}



module.exports = {getClassifications,getInventoryByClassificationId,getInventoryById,insertClassificationModel,insertInventoryModel,updateInventoryModel,deleteInventoryModel}