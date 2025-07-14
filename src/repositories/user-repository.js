import { Pool } from "pg";
import DBConfig from "../configs/db-config.js";

const pool = new Pool(DBConfig);

const getUserPasswordByUsernameAsync = async (username) => {
    const SQL = `SELECT * FROM users WHERE LOWER(username) = LOWER($1)`;
    const values = [username];
    const returnEntity = await pool.query(SQL, values);
    return returnEntity.rowCount > 0 ? returnEntity.rows[0] : null;
}

const createAsync = async (firstName, lastName, username, password) => {
    const SQL = `INSERT INTO users (first_name, last_name, username, password)
                 VALUES ($1, $2, $3, $4) RETURNING id`;
    const values = [firstName, lastName, username, password];
    const result = await pool.query(SQL, values);
    return result.rowCount > 0 ? result.rows[0].id : null;
}

export { getUserPasswordByUsernameAsync, createAsync };