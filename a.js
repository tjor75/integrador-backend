import * as eventService from "./src/services/event-service.js";

try {
    const badRequest = await eventService.unenrollAsync("a", "a");
} catch (error) {
    console.error("/" + typeof error, "/" + error.message, "/" + error.name);
}