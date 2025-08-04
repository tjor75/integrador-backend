import { Pool } from "pg";
import DBConfig from "../configs/db-config.js";
import { createUpdateSql } from "../helpers/updater-helper.js";

const pool = new Pool(DBConfig);

const getMaxCapacityById = async (id) => {
    const sql = `SELECT max_capacity FROM event_locations WHERE id = $1;`;
    const values = [id];
    const resultPg = await pool.query(sql, values);
    const result = resultPg.rows.length > 0 ? resultPg.rows[0].max_capacity : null;
    return result;
};

export {
    getMaxCapacityById
};