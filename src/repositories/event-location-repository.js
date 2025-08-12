import { Pool } from "pg";
import DBConfig from "../configs/db-config.js";
import { createUpdateSql } from "../helpers/updater-helper.js";

const pool = new Pool(DBConfig);

export const getMaxCapacityById = async (id) => {
    const sql = `SELECT max_capacity FROM event_locations WHERE id = $1;`;
    const values = [id];
    const resultPg = await pool.query(sql, values);
    const result = resultPg.rows.length > 0 ? resultPg.rows[0].max_capacity : null;
    return result;
};

export const getAllAsync = async (creatorUserId) => {
    const sql = `SELECT * FROM event_locations WHERE id_creator_user = $1;`;
    const values = [creatorUserId];
    const resultPg = await pool.query(sql, values);
    return resultPg.rows;
};

export const getByIdAsync = async (id, creatorUserId) => {
    const sql = `SELECT * FROM event_locations WHERE id = $1 AND id_creator_user = $2;`;
    const values = [id, creatorUserId];
    const resultPg = await pool.query(sql, values);
    return resultPg.rows.length > 0 ? resultPg.rows[0] : null;
};

export const createAsync = async (eventLocation) => {
    const sql = `INSERT INTO event_locations (name, full_address, id_location, max_capacity, id_creator_user) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id;`;
    const values = [
        eventLocation.name,
        eventLocation.full_address,
        eventLocation.id_location,
        eventLocation.max_capacity,
        eventLocation.id_creator_user
    ];
    const resultPg = await pool.query(sql, values);
    return resultPg.rows[0].id;
};

export const updateAsync = async (id, creatorUserId, eventLocationUpdate) => {
    const columns = Object.keys(eventLocationUpdate);
    const row = Object.values(eventLocationUpdate);
        
    const sql = createUpdateSql("event_locations", columns, ["id", "id_creator_user"]);
    const values = [...row, id, creatorUserId];
    const resultPg = await pool.query(sql, values);
        
    return resultPg.rowCount;
};

export const deleteAsync = async (id) => {
    const sql = `DELETE FROM event_locations WHERE id = $1;`;
    const values = [id];
    const resultPg = await pool.query(sql, values);
    return resultPg.rowCount > 0;
};

export const existsLocationByIdAsync = async (id) => {
    const sql = `SELECT 1 FROM locations WHERE id = $1 LIMIT 1;`;
    const values = [id];
    const resultPg = await pool.query(sql, values);
    return resultPg.rowCount > 0;
};

export const listBaseLocationsWithProvinceAsync = async () => {
    const sql = `
        SELECT l.id,
               l.name AS location_name,
               l.id_province,
               l.latitude,
               l.longitude,
               p.full_name AS province_name
        FROM locations l
        JOIN provinces p ON p.id = l.id_province
        ORDER BY p.display_order, l.name;
    `;
    const resultPg = await pool.query(sql);
    return resultPg.rows;
};