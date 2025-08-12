import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import * as userService from "../services/user-service.js";
import * as eventLocationService from "../services/event-location-service.js";
import { getSerialOrDefault } from "../helpers/validator-helper.js";

const router = Router();

router.get("/", async (req, res) => {
    const user = userService.getCurrentUserAsync(req);

    if (user) {
        try {
            const eventLocation = await eventLocationService.getAllAsync(user.id);
            res.status(StatusCodes.OK).json(eventLocation);
        } catch (internalError) {
            console.error(internalError);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
        }
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
});

// Listado de localidades base con sus provincias (para selector)
router.get("/base-locations", async (req, res) => {
    try {
        const list = await eventLocationService.listBaseLocationsWithProvinceAsync();
        res.status(StatusCodes.OK).json(list);
    } catch (internalError) {
        console.error(internalError);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
    }
});

router.get("/:id", async (req, res) => {
    const user = await userService.getCurrentUserAsync(req); // Ensure this is awaited
    if (!user) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const id = getSerialOrDefault(req.params.id, null);
    if (id === null) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    try {
        const eventLocation = await eventLocationService.getByIdAsync(id);

        // Check if the authenticated user is the creator of the event location
        if (eventLocation && eventLocation.id_creator_user === user.id) {
            res.status(StatusCodes.OK).json(eventLocation);
        } else if (!eventLocation) {
            res.sendStatus(StatusCodes.NOT_FOUND);
        } else {
            res.sendStatus(StatusCodes.FORBIDDEN); // User is not the creator
        }
    } catch (internalError) {
        console.error(internalError);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
    }
});

router.post("/", async (req, res) => {
    const user = await userService.getCurrentUserAsync(req);
    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Usuario no autenticado.");
    }

    const { name, full_address, id_location, max_capacity } = req.body;

    // Validaciones de negocio
    if (
        !name || typeof name !== "string" || name.trim().length < 3 ||
        !full_address || typeof full_address !== "string" || full_address.trim().length < 3
    ) {
        return res.status(StatusCodes.BAD_REQUEST).send("El nombre y la dirección deben tener al menos 3 letras.");
    }

    if (!id_location || !(await eventLocationService.locationExistsAsync(id_location))) {
        return res.status(StatusCodes.BAD_REQUEST).send("El id_location es inexistente.");
    }

    if (typeof max_capacity !== "number" || max_capacity <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).send("La capacidad máxima debe ser mayor a cero.");
    }

    try {
        const newEventLocation = {
            name: name.trim(),
            full_address: full_address.trim(),
            id_location,
            max_capacity,
            id_creator_user: user.id
        };

        const created = await eventLocationService.createAsync(newEventLocation);
        res.status(StatusCodes.CREATED).json(created);
    } catch (internalError) {
        console.error(internalError);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
    }
});


export default router;