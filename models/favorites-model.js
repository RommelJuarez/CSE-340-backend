const pool = require("../database/")

async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO public.favorites (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *;
  `;
  return pool.query(sql, [account_id, inv_id]);
}

async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT f.favorite_id, i.inv_make, i.inv_model, i.inv_image, i.inv_price, i.inv_id
    FROM public.favorites f
    JOIN public.inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1;
  `;
  const result = await pool.query(sql, [account_id]);
  return result.rows;
}

async function deleteFavorite(favorite_id, account_id) {
  const sql = `
    DELETE FROM public.favorites
    WHERE favorite_id = $1 AND account_id = $2;
  `;
  return pool.query(sql, [favorite_id, account_id]);
}

module.exports = { addFavorite, getFavoritesByAccount, deleteFavorite };
