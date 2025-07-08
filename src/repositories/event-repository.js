import { Pool } from "pg";
import DBConfig from "../configs/db-config.js";

const pool = new Pool(DBConfig);

const getPageAsync = async (pageNumber=1, limit, filters) => {
    const SQL = `SELECT events.*, users.*, locations.*
    FROM events
    INNER JOIN users ON events.id_creator_user = users.id
    INNER JOIN event_categories ON events.id_event_category = event_categories.id
    INNER JOIN event_locations ON events.id_event_location = event_locations.id
    INNER JOIN locations ON event_locations.id_location = locations.id
    WHERE events.id >= CAST($1 as int4) * CAST($2 as int4) - 1
    AND ($3 IS NULL OR events.name LIKE '%' || CAST($3 AS varchar) || '%')
    AND ($4 IS NULL OR events.start_date >= CAST($4 AS timestamp))
    AND ($5 IS NULL OR event_categories.name LIKE CAST($5 AS varchar))
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