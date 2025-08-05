import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import * as eventService from "../services/event-service.js";
import * as userService from "../services/user-service.js";
import { getDateOrDefault, getFloatOrDefault, getIntegerOrDefault, getRegisterStringOrDefault, getSerialOrDefault } from "../helpers/type-helper.js";

const router = Router();

router.get("/", async (req, res) => {
    const entity = req.query;
    const pageNumber = getSerialOrDefault(entity.page_number, 1);
    const filters = {
        name: entity.name || null,
        startDate: getDateOrDefault(entity.start_date, null),
        tag: entity.tag || null
    };

    try {
        const events = await eventService.getAllAsync(pageNumber, filters);
        res.send(events);
    } catch (internalError) {
        console.error(internalError);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    
    try {
        const event = await eventService.getByIdAsync(id);
        if (event !== null)
            res.send(event);
        else
            res.statusCode(StatusCodes.NOT_FOUND);
    } catch (internalError) {
        console.error(internalError);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
    }
});

router.post("/", async (req, res) => {
    const user = await userService.getCurrentUserAsync(req);
    let badRequest = null;
    
    if (user !== null) {
        const event = {
            name                    : getRegisterStringOrDefault(req.body?.name, null),
            description             : getRegisterStringOrDefault(req.body?.description, null),
            idEventCategory         : getSerialOrDefault(req.body?.id_event_category, null),
            idEventLocation         : getSerialOrDefault(req.body?.id_event_location, null),
            startDate               : getDateOrDefault(req.body?.start_date, null),
            durationInMinutes       : getIntegerOrDefault(req.body?.duration_in_minutes, null),
            price                   : getFloatOrDefault(req.body?.price, 0),
            enabledForEnrollment    : req.body?.enabled_for_enrollment === "1",
            maxAssistance           : getIntegerOrDefault(req.body?.max_assistance, null),
            creatorUserId           : user.id
        };

        try {
            badRequest = await eventService.checkCreateAsync(event);

            if (!badRequest) {
                const id = await eventService.createAsync(event);
                if (id !== null)
                    res.sendStatus(StatusCodes.CREATED);
                else
                    res.sendStatus(StatusCodes.BAD_REQUEST);
            } else {
                res.status(StatusCodes.BAD_REQUEST).send(badRequest);
            }
        } catch (internalError) {
            console.error(internalError);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
        }
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
});

router.put("/", async (req, res) => {
    const user = await userService.getCurrentUserAsync(req);
    const body = req.body;
    let badRequest = null;

    if (user !== null) {
        const id = getSerialOrDefault(req.body?.id, null);
        const creatorUserId = user.id;
        const eventupdateAsync = {};

        try {
            if (id === null)
                badRequest = "El id del evento no es válido.";

            if (!badRequest && typeof body?.name === "string") {
                const name = body?.name.trim();
                if (name.length >= 3)
                    eventUpdate.name = name;
                else
                    badRequest = "El nombre del evento debe tener al menos tres (3) letras.";
            }

            if (!badRequest && typeof body?.description === "string") {
                const description = body?.description.trim();
                if (description.length < 3)
                    badRequest = "La descripción del evento debe tener al menos tres (3) letras.";
                else
                    eventUpdate.description = description;
            }

            if (!badRequest && body?.id_event_category) {
                const idEventCategory = parseInt(body?.id_event_category, 10);
                if (!isNaN(idEventCategory) && idEventCategory >= 1)
                    eventUpdate.id_event_category = idEventCategory;
                else
                    badRequest = "El id de la categoría del evento no es válido.";
            }

            if (!badRequest && body?.id_event_location) {
                const idEventLocation = parseInt(body?.id_event_location, 10);
                if (!isNaN(idEventLocation) && idEventLocation >= 1)
                    eventUpdate.id_event_location = idEventLocation;
                else
                    badRequest = "El id de la locación del evento no es válido.";                    
            }

            if (typeof body?.start_date === "string") {
                const startDate = getDateOrDefault(body?.start_date, null);
                if (startDate !== null)
                    eventUpdate.start_date = startDate;
                else
                    badRequest = "La fecha de inicio del evento no es válida.";
            }

            if (!badRequest && typeof body?.duration_in_minutes === "string") {
                const durationInMinutes = parseInt(body?.duration_in_minutes, 10);
                if (!isNaN(durationInMinutes) && durationInMinutes < 0)
                    eventUpdate.duration_in_minutes = durationInMinutes;
                else
                    badRequest = "La duración del evento debe ser un número mayor o igual a 0.";
            }

            if (!badRequest && typeof body?.price === "string") {
                const price = parseFloat(body?.price);
                if (!isNaN(price) && price >= 0)
                    eventUpdate.price = price;
                else
                    badRequest = "El precio del evento no puede ser negativo.";
            }

            if (!badRequest && typeof body?.enabled_for_enrollment === "string")
                eventUpdate.enabled_for_enrollment = body?.enabled_for_enrollment === "1";

            if (!badRequest && typeof body?.max_assistance === "string") {
                eventUpdate.max_assistance = parseInt(body?.max_assistance, 10);
                if (isNaN(eventUpdate.max_assistance) || eventUpdate.max_assistance < 1)
                    badRequest = "La asistencia debe ser un número mayor o igual a 1.";
                else if (eventUpdate.id_event_location !== null) {
                    const maxCapacity = await eventLocationService.getMaxCapacityById(eventUpdate.id_event_location);
                    if (maxCapacity === null)
                        badRequest = "No existe la locación del evento.";
                    else if (eventUpdate.max_assistance > maxCapacity)
                        badRequest = "La asistencia no puede ser mayor a la capacidad máxima del lugar.";
                }
            }
            
            if (badRequest === null) {
                const rowsAffected = await eventService.updateAsync(id, creatorUserId, eventUpdate);
                if (rowsAffected !== 0)
                    res.sendStatus(StatusCodes.CREATED);
                else
                    res.sendStatus(StatusCodes.NOT_FOUND);
            } else {
                res.status(StatusCodes.BAD_REQUEST).send(badRequest);
            }
        } catch (internalError) {
            console.error(internalError);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
        }
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
});

router.delete("/:id", async (req, res) => {
    const user = await userService.getCurrentUserAsync(req);
    let badRequest = null;

    if (user !== null) {
        const id = getSerialOrDefault(req.params.id, null);

        try {
            if (id !== null)
                badRequest = "El ID del evento no es válido.";
            else if (await eventService.getEnrollmentCountAsync(id) > 0)
                badRequest = "No se puede eliminar un evento con inscripciones.";

            if (badRequest !== null) {
                const rowsAffected = await eventService.deleteAsync(id, user.id);
                if (rowsAffected !== 0)
                    res.sendStatus(StatusCodes.OK);
                else
                    res.sendStatus(StatusCodes.NOT_FOUND);
            } else {
                res.sendStatus(StatusCodes.BAD_REQUEST);
            }
        } catch (internalError) {
            console.error(internalError);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
        }
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
});

router.get("/:id/enrollment", async (req, res) => {
    const user = await userService.getCurrentUserAsync(req);

    if (user !== null) {
        const id = getIntegerOrDefault(req.params.id, null);

        if (id !== null) {
            try {
                const result = await eventService.checkEnrollmentAsync(id, user.id);
                if (result)
                    res.sendStatus(StatusCodes.OK);
                else
                    res.sendStatus(StatusCodes.NOT_FOUND);
            } catch (internalError) {
                console.error(internalError);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).send("ID del evento no válido.");
        }
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
});

router.post("/:id/enrollment", async (req, res) => {
    const user = await userService.getCurrentUserAsync(req);
    let badRequest = null;

    if (user !== null) {
        const id = getIntegerOrDefault(req.params.id, null);

        if (id !== null) {
            try {
                badRequest = await eventService.enrollAsync(id, user.id);
                if (badRequest === null)
                    res.sendStatus(StatusCodes.CREATED);
                else
                    res.status(StatusCodes.BAD_REQUEST).send(badRequest);
            } catch (internalError) {
                console.error(internalError);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
            }
        }
        else {
            res.status(StatusCodes.BAD_REQUEST).send("ID del evento no válido.");
        }
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
});

router.delete("/:id/enrollment", async (req, res) => {
    const user = await userService.getCurrentUserAsync(req);
    let badRequest = null;

    if (user !== null) {
        const id = getIntegerOrDefault(req.params.id, null);

        if (id !== null) {
            try {
                badRequest = await eventService.unenrollAsync(id, user.id);
                if (badRequest === null)
                    res.sendStatus(StatusCodes.CREATED);
                else
                    res.status(StatusCodes.BAD_REQUEST).send(badRequest);
            } catch (internalError) {
                console.error(internalError);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
            }
        }
        else {
            res.status(StatusCodes.BAD_REQUEST).send("ID del evento no válido.");
        }
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
});

export default router;