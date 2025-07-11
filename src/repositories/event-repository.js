import { Pool } from "pg";
import DBConfig from "../configs/db-config.js";

const pool = new Pool(DBConfig);

const getPageAsync = async (pageNumber=1, limit, filters) => {
    const SQL = `SELECT
        events.id,
        events.name,
        events.description,
        events.start_date,
        events.duration_in_minutes,
        events.price,
        events.enabled_for_enrollment,
        events.id_creator_user,
        users.first_name AS first_name_creator_user,
        users.last_name AS last_name_creator_user,
        locations.id AS id_location,
        locations.name AS name_location,
        locations.longitude AS longitude_location,
        locations.latitude AS latitude_location
    FROM events
    INNER JOIN users ON events.id_creator_user = users.id
    INNER JOIN event_categories ON events.id_event_category = event_categories.id
    INNER JOIN event_locations ON events.id_event_location = event_locations.id
    INNER JOIN locations ON event_locations.id_location = locations.id
    INNER JOIN provinces ON locations.id_province = provinces.id
    INNER JOIN event_tags ON events.id = event_tags.id_event
    INNER JOIN tags ON event_tags.id_tag = tags.id
    WHERE
    (CAST($3 AS VARCHAR) IS NULL OR events.name LIKE '%' || CAST($3 AS VARCHAR) || '%')
    AND (CAST($4 AS TIMESTAMP) IS NULL OR events.start_date >= CAST($4 AS TIMESTAMP))
    AND (CAST($5 AS VARCHAR) IS NULL OR LOWER(tags.name) = LOWER(CAST($5 AS VARCHAR)))
    ORDER BY events.id
    LIMIT $2
    OFFSET ($1 - 1) * $2`;

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

const getTagsFromEventAsync = async (eventId) => {
    const SQL = `SELECT tags.* FROM event_tags
    INNER JOIN tags ON event_tags.id_tag = tags.id
    WHERE event_tags.id_event = $1
    AND (CAST($1 AS VARCHAR) IS NULL OR events.name LIKE '%' || CAST($3 AS VARCHAR) || '%')`;

    const values = [eventId];
};

export { getPageAsync };