import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { getDateOrDefault, getSerialOrDefault } from "../helpers/validatorHelper";
import eventRepository from "../repositories/eventRepository.js";

const router = Router();

router.get("/", async (req, res) => {
    const filters = {
        pageNumber: getSerialOrDefault(req.query?.page_number, null),
        name: req.query?.name ?? null,
        startDate: getDateOrDefault(req.query?.startdate, null)
    };

    try {
        const events = await eventRepository.getPageAsync(filters);
    } catch (internalError) {
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