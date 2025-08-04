import { Pool } from "pg";
import DBConfig from "../configs/db-config.js";
import { createUpdateSql } from "../helpers/updater-helper.js";

const pool = new Pool(DBConfig);

const getAllAsync = async (pageNumber=1, limit, filters) => {
    const sql = `SELECT
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

    const returnArray = await pool.query(sql, values);
    return returnArray.rows;
};

/*
* Retrieves an event by its ID.
* @param {number} id - The ID of the event to retrieve.
* @returns {Promise<Object|null>} The event object if found, otherwise null.
*/
const getByIdAsync = async (id) => {
    const sql = `SELECT
        events.id,
        events.name,
        events.description,
        events.start_date,
        CAST(events.duration_in_minutes AS VARCHAR),
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
        ) AS event_location,
        COALESCE(json_agg(tags) FILTER (WHERE tags.id IS NOT NULL), '[]') AS tags,
        json_build_object(
            'id',           events.id_creator_user,
            'first_name',   users.first_name,
            'last_name',    users.last_name,
            'username',     users.username
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
        provinces.longitude, provinces.display_order, users.username,
        users.first_name, users.last_name
    LIMIT 1`;

    const values = [id];

    const response = await pool.query(sql, values);
    const entity = response.rowCount > 0 ? response.rows[0] : null;
    return entity;
}

const createAsync = async (event) => {
    const sql = `INSERT INTO events (
        name,
        description,
        id_event_category,
        id_event_location,
        start_date,
        duration_in_minutes,
        price,
        max_assistance,
        id_creator_user
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;`;

    const values = [
        event.name,
        event.descripcion,
        event.idEventCategory,
        event.idEventLocation,
        event.startDate,
        event.durationInMinutes,
        event.idCreatorUser
    ];

    const resultPg = await pool.query(sql, values);
    const id = resultPg.rowCount > 0 ? resultPg.rows[0].id : null;
    return id;
};

const updateByIdAsync = async (id, creatorUserId, eventUpdate) => {
    const eventColumns = Object.keys(eventUpdate);
    const eventRow = Object.values(eventUpdate);

    const sql = createUpdateSql("events", eventColumns, ["id", "id_creator_user"]);
    const values = [...eventRow, id, creatorUserId];
    const resultPg = await pool.query(sql, values);

    return resultPg.rowCount;
};

const deleteAsync = async (id, creatorUserId) => {
    const sql = `DELETE FROM events WHERE id = $1 AND id_creator_user = $2;`;
    const values = [id, creatorUserId];
    const resultPg = await pool.query(sql, values);
    return resultPg.rowCount;
};

const getEnrollmentCountAsync = async (eventId) => {
    const sql = `SELECT COUNT(*) AS enrollment_count FROM event_enrollments WHERE id_event = $1;`;
    const values = [eventId];
    const resultPg = await pool.query(sql, values);
    const count = parseInt(resultPg.rows[0].enrollment_count, 10);
    return count;
}

const doEnrollmentCheckAsync = async (eventId, userId) => {
    const sql = `
        SELECT
            e.id AS event_id,
            e.max_assistance,
            e.start_date,
            e.enabled_for_enrollment,
            (
                SELECT COUNT(*) FROM event_enrollments ee WHERE ee.id_event = e.id
            ) AS current_enrollments,
            (
                SELECT id FROM event_enrollments ee2 WHERE ee2.id_event = e.id AND ee2.id_user = $2
            ) AS user_already_enrolled
        FROM events e
        WHERE e.id = $1
        LIMIT 1;
    `;
    const values = [eventId, userId];
    const resultPg = await pool.query(sql, values);
    const result = resultPg.rowCount > 0 ? resultPg.rows[0] : null;
    return result;
};

const doUnenrollmentCheckAsync = async (eventId, userId) => {
    const sql = `
        SELECT
            e.id AS event_id,
            e.start_date,
            (
                SELECT id FROM event_enrollments ee WHERE ee.id_event = e.id AND ee.id_user = $2
            ) AS user_already_enrolled
        FROM events e
        WHERE e.id = $1
        LIMIT 1;`;
    const values = [eventId, userId];
    const resultPg = await pool.query(sql, values);
    
    const result = resultPg.rowCount > 0 ? resultPg.rows[0] : null;
    return result;
};

const enrollWithCheckAsync = async (eventId, userId) => {
    const sql = `INSERT INTO event_enrollments (id_event, id_user)
                 VALUES ($1, $2)
                 ON CONFLICT (id_event, id_user) DO NOTHING
                 RETURNING id;`;
    const values = [eventId, userId];
    const resultPg = await pool.query(sql, values);

    const success = resultPg.rowCount > 0;
    return success;
};

const enrollAsync = async (eventId, userId) => {
    const sql = `INSERT INTO event_enrollments (id_event, id_user)
                 VALUES ($1, $2);`;
    const values = [eventId, userId];
    await pool.query(sql, values);
};

const unenrollAsync = async (eventId, userId) => {
    const sql = `DELETE FROM event_enrollments WHERE id_event = $1 AND id_user = $2;`;
    const values = [eventId, userId];
    const resultPg = await pool.query(sql, values);

    const success = resultPg.rowCount > 0;
    return success;
};

export {
    getAllAsync,
    getByIdAsync,
    createAsync,
    updateByIdAsync,
    deleteAsync,
    getEnrollmentCountAsync,
    doEnrollmentCheckAsync,
    doUnenrollmentCheckAsync,
    enrollAsync,
    unenrollAsync
};