import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import * as userService from "../services/user-service.js";
import * as eventLocationService from "../services/event-location-service.js";

const router = Router();

router.get("/", async (req, res) => {
    const user = userService.getCurrentUserAsync(req);

    if (user) {
        try {
            const eventLocation = await eventLocationService.getAllByCreatorUserAsync(user.id);
            res.status(StatusCodes.OK).json(eventLocation);
        } catch (internalError) {
            console.error(internalError);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
        }
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
});

export default router;