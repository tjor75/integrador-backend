import { Pool } from "pg";
import DBConfig from "../configs/db-config.js";

const pool = new Pool(DBConfig);

export const getUserPasswordByUsernameAsync = async (username) => {
    const sql = `SELECT * FROM users WHERE LOWER(username) = LOWER($1)`;
    const values = [username];
    const returnEntity = await pool.query(sql, values);
    return returnEntity.rowCount > 0 ? returnEntity.rows[0] : null;
};

export const createAsync = async (firstName, lastName, username, password) => {
    const sql = `INSERT INTO users (first_name, last_name, username, password)
                 VALUES ($1, $2, $3, $4) RETURNING id`;
    const values = [firstName, lastName, username, password];
    const result = await pool.query(sql, values);
    return result.rowCount > 0 ? result.rows[0].id : null;
};