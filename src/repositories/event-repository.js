import { Pool } from "pg";
import DBConfig from "../configs/db-config.js";

const pool = new Pool(DBConfig);

const getPageAsync = async (pageNumber=1, limit, filters) => {
    const SQL = `SELECT
        events.*,
        users.*,
        locations.*
    FROM events
    INNER JOIN users ON events.id_creator_user = users.id
    INNER JOIN event_categories ON events.id_event_category = event_categories.id
    INNER JOIN event_locations ON events.id_event_location = event_locations.id
    INNER JOIN locations ON event_locations.id_location = locations.id
    INNER JOIN provinces ON locations.id_province = provinces.id
    WHERE events.id > (CAST($1 AS int4) - 1) * CAST($2 AS int4)
    AND (CAST($3 AS VARCHAR) IS NULL OR events.name LIKE '%' || CAST($3 AS VARCHAR) || '%')
    AND (CAST($4 AS TIMESTAMP) IS NULL OR events.start_date >= CAST($4 AS TIMESTAMP))
    AND (CAST($5 AS VARCHAR) IS NULL OR LOWER(event_categories.name) = LOWER(CAST($5 AS VARCHAR)))
    LIMIT $2;`;

    const values = [
        pageNumber,
        limit,
        filters.name,
        filters.startDate,
        filters.tag
    ];

    const returnArray = await pool.query(SQL, values);
    return returnArray.rows;
};

export { getPageAsync };