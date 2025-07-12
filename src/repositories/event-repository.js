import { Pool } from "pg";
import DBConfig from "../configs/db-config.js";

const pool = new Pool(DBConfig);

const getAllAsync = async (pageNumber=1, limit, filters) => {
    const SQL = `SELECT
        events.id,
        events.name,
        events.description,
        events.start_date,
        CAST(events.duration_in_minutes AS VARCHAR),
        events.price,
        events.enabled_for_enrollment,
        json_build_object(
            'id',           events.id_creator_user,
            'first_name',   users.first_name,
            'last_name',    users.last_name
        ) AS creator_user,
        json_build_object(
            'id',           locations.id,
            'name',         locations.name,
            'longitude',    CAST(locations.longitude AS VARCHAR),
            'latitude',     CAST(locations.latitude AS VARCHAR)
        ) AS location
    FROM events
    INNER JOIN users ON events.id_creator_user = users.id
    INNER JOIN event_categories ON events.id_event_category = event_categories.id
    INNER JOIN event_locations ON events.id_event_location = event_locations.id
    INNER JOIN locations ON event_locations.id_location = locations.id
    INNER JOIN provinces ON locations.id_province = provinces.id
    LEFT JOIN event_tags ON events.id = event_tags.id_event
    LEFT JOIN tags ON event_tags.id_tag = tags.id
    WHERE
        (CAST($3 AS VARCHAR) IS NULL OR LOWER(events.name) LIKE '%' || LOWER(CAST($3 AS VARCHAR)) || '%')
        AND (CAST($4 AS TIMESTAMP) IS NULL OR events.start_date >= CAST($4 AS TIMESTAMP))
        AND (CAST($5 AS VARCHAR) IS NULL OR LOWER(tags.name) = LOWER(CAST($5 AS VARCHAR)))
    GROUP BY events.id, events.name, events.description, events.start_date,
        events.duration_in_minutes, events.price, events.enabled_for_enrollment,
        users.first_name, users.last_name, locations.id, locations.name,
        locations.longitude, locations.latitude
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

const getByIdAsync = async (id) => {
    const SQL = `SELECT
        events.id,
        events.name,
        events.description,
        events.start_date,
        events.duration_in_minutes,
        events.price,
        events.enabled_for_enrollment,
        json_build_object(
            'id',           events.id_event_location,
            'name',         event_locations.name,
            'full_address', event_locations.full_address,
            'max_capacity', event_locations.max_capacity,
            'longitude',    CAST(event_locations.longitude AS VARCHAR),
            'latitude',     CAST(event_locations.latitude AS VARCHAR),
            'location',     json_build_object(
                'id',         locations.id,
                'name',       locations.name,
                'longitude',  CAST(locations.longitude AS VARCHAR),
                'latitude',   CAST(locations.latitude AS VARCHAR),
                'province',   json_build_object(
                    'id',             provinces.id,
                    'name',           provinces.name,
                    'full_name',      provinces.full_name,
                    'latitude',       CAST(provinces.latitude AS VARCHAR),
                    'longitude',      CAST(provinces.longitude AS VARCHAR),
                    'display_order',  provinces.display_order
                )
            )
        ),
        COALESCE(json_agg(tags) FILTER (WHERE tags.id IS NOT NULL), '[]') AS tags,
        json_build_object(
            'id',         events.id_creator_user,
            'first_name', users.first_name,
            'last_name',  users.last_name
        ) AS creator_user
    FROM events
    INNER JOIN users ON events.id_creator_user = users.id
    INNER JOIN event_categories ON events.id_event_category = event_categories.id
    INNER JOIN event_locations ON events.id_event_location = event_locations.id
    INNER JOIN locations ON event_locations.id_location = locations.id
    INNER JOIN provinces ON locations.id_province = provinces.id
    LEFT JOIN event_tags ON events.id = event_tags.id_event
    LEFT JOIN tags ON event_tags.id_tag = tags.id
    WHERE events.id = $1
    GROUP BY
        events.id, events.name, events.description, events.start_date,
        events.duration_in_minutes, events.price, events.enabled_for_enrollment,
        event_locations.id, event_locations.name, event_locations.full_address,
        event_locations.max_capacity, event_locations.longitude,
        event_locations.latitude, locations.id, locations.name,
        locations.longitude, locations.latitude, provinces.id,
        provinces.name, provinces.full_name, provinces.latitude,
        provinces.longitude, provinces.display_order, users.first_name,
        users.last_name
    LIMIT 1`;

    const values = [id];

    const returnEntity = await pool.query(SQL, values);
    console.log('DB result:', returnEntity.rows);
    return returnEntity.rowCount > 0 ? returnEntity.rows[0] : null;
}

const getTagsFromEventAsync = async (eventId) => {
    const SQL = `SELECT tags.* FROM event_tags
    INNER JOIN tags ON event_tags.id_tag = tags.id
    WHERE event_tags.id_event = $1
    AND (CAST($1 AS VARCHAR) IS NULL OR events.name LIKE '%' || CAST($3 AS VARCHAR) || '%')`;

    const values = [eventId];
};

export { getAllAsync, getByIdAsync };