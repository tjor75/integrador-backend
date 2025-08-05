import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import * as userService from "../services/user-service.js";
import { getEmailOrDefault, getRegisterStringOrDefault } from "../helpers/type-helper.js";

const router = Router();

router.post("/login", async (req, res) => {
    const username = getEmailOrDefault(req.body?.username, null);
    const password = req.body?.password || null;
    const result = { success: false, message: "", token: "" };
    let statusCode;

    if (!(username === null || password === null)) {
        try {
            const token = await userService.loginAsync(username, password);
            if (token !== null) {
                statusCode = StatusCodes.OK;
                result.success = true;
                result.token = token;
            } else {
                statusCode = StatusCodes.UNAUTHORIZED;
                result.message = "Credenciales invalidas.";
            }
        } catch (internalError) {
            console.error(internalError);
            statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            result.message = internalError.message;
        }
    } else {
        statusCode = StatusCodes.BAD_REQUEST;
        result.message = "El usuario y la contraseña son requeridos.";
    }

    res.status(statusCode).send(result);
});

router.post("/register", async (req, res) => {
    const firstName = getRegisterStringOrDefault(req.body?.first_name, null);
    const lastName  = getRegisterStringOrDefault(req.body?.last_name, null);
    const username  = getEmailOrDefault(req.body?.username, null);
    const password  = getRegisterStringOrDefault(req.body?.password, null);

    if (!(firstName === null || lastName === null || username === null || password === null)) {
        try {
            const id = await userService.registerAsync(firstName, lastName, username, password);
            if (id !== null)
                res.sendStatus(StatusCodes.CREATED);
            else
                res.sendStatus(StatusCodes.BAD_REQUEST);
        } catch (internalError) {
            console.error(internalError);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(internalError.message);
        }
    } else {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

export default router;