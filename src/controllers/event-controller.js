import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import * as eventService from "../services/event-service.js";

const router = Router();

router.get("/", async (req, res) => {
    const entity = req.query;
    try {
        const events = await eventService.getAllAsync(entity);
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

router.post("/", async () => {
    
});

router.put("/", async () => {
    
});

router.delete("/:id", async () => {
    
});

export default router;