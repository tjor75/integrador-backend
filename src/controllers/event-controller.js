import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import * as eventService from "../services/event-service.js";
import * as userService from "../services/user-service.js";
import { getDateOrDefault, getFloatOrDefault, getIntegerOrDefault, getRegisterStringOrDefault, getSerialOrDefault } from "../helpers/validator-helper.js";

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
    
    if (user !== null) {
        const event = {
            name                : getRegisterStringOrDefault(req.body?.name, null),
            description         : getRegisterStringOrDefault(req.body?.description, null),
            idEventCategory     : getSerialOrDefault(req.body?.id_event_category, null),
            idEventLocation     : getSerialOrDefault(req.body?.id_event_location, null),
            startDate           : getDateOrDefault(req.body?.start_date, null),
            durationInMinutes   : getFloatOrDefault(req.body?.duration_in_minutes, null),
            price               : getFloatOrDefault(req.body?.price, null),
            maxAssistance       : getIntegerOrDefault(req.body?.max_assistance, null),
            idCreatorUser       : user.id
        };

        try {
            const id = await eventService.createAsync(event);
            if (id !== null)
                res.sendStatus(StatusCodes.CREATED);
            else
                res.sendStatus(StatusCodes.BAD_REQUEST);
        } catch (internalError) {
            console.error(internalError);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
});

router.put("/", async () => {
    const user = await userService.getCurrentUserAsync(req);

    if (user !== null) {
        const id = getSerialOrDefault(req.body?.id, null);
        const creatorUserId = user.id;
        //const numberOfFields = ;
        const eventUpdate = {
            name                : getRegisterStringOrDefault(req.body?.name, null),
            description         : getRegisterStringOrDefault(req.body?.description, null),
            id_event_category   : getSerialOrDefault(req.body?.id_event_category, null),
            id_event_location   : getSerialOrDefault(req.body?.id_event_location, null),
            start_date          : getDateOrDefault(req.body?.start_date, null),
            duration_in_minutes : getFloatOrDefault(req.body?.duration_in_minutes, null),
            price               : getFloatOrDefault(req.body?.price, null),
            max_assistance      : getIntegerOrDefault(req.body?.max_assistance, null)
        };
        //const numberOfValidFields = Object.values(eventUpdate).filter(value => value !== null).length;
        

        //if (id !== null) {
        if (id !== null && Object.values(eventUpdate).some(value => value !== null)) {
            try {
                const rowsAffected = await eventService.updateByIdAsync(id, creatorUserId, eventUpdate);
                if (rowsAffected !== 0)
                    res.sendStatus(StatusCodes.CREATED);
                else
                    res.sendStatus(StatusCodes.BAD_REQUEST);
            } catch (internalError) {
                console.error(internalError);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
            }
            res.sendStatus(200);
        } else {
            res.sendStatus(StatusCodes.BAD_REQUEST);
        }
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
});

router.delete("/:id", async () => {
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

export default router;