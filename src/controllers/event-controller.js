import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import * as eventService from "../services/event-service.js";

const router = Router();

router.get("/", async (req, res) => {
    const entity = req.query;
    try {
        const events = await eventService.getPageAsync(entity);
        res.send(events);
    } catch (internalError) {
        console.error(internalError);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError);
    }
});

router.get("/:id", async () => {
    
});

router.post("/", async () => {
    
});

router.put("/", async () => {
    
});

router.delete("/:id", async () => {
    
});

export default router;