import { Pool } from "pg";
import DBConfig from "../configs/db-config.js";

const pool = new Pool(DBConfig);

const getPageAsync = async (pageNumber=1, limit, filters={}) => {
    const SQL = `SELECT events.*, users.*, locations.*
    FROM events
    INNER JOIN users ON events.id_creator_user = users.id
    INNER JOIN event_locations ON events.id_event_location = event_locations.id
    INNER JOIN locations ON event_locations.id_location = locations.id
    WHERE
    events.id >= ${pageNumber * limit - 1}
    AND ($1 = NULL OR name LIKE '%$1%')
    AND ($2 = NULL OR start_date >= $2)
    AND ($3 = NULL OR tag LIKE $3)
    LIMIT ${limit};`;
    const values = [filters.name, filters.startDate, filters.tag];
    const returnArray = await pool.query(SQL);
    return returnArray.rows;
};

export { getPageAsync };