import * as eventLocationService from "../services/event-location-service.js";

export const formatEventUpdate = async (body, eventUpdate) => {
    let error = null;
    
    if (!error && typeof body?.name === "string") {
        const name = body?.name.trim();
        if (name.length >= 3)   eventUpdate.name = name;
        else                    error = "El nombre del evento debe tener al menos tres (3) letras.";
    }

    if (!error && typeof body?.description === "string") {
        const description = body?.description.trim();
        if (description.length >= 3)    eventUpdate.description = description;
        else                            error = "La descripción del evento debe tener al menos tres (3) letras.";
    }

    if (!error && typeof body?.id_event_category === "number") {
        const idEventCategory = parseInt(body?.id_event_category, 10);
        if (idEventCategory >= 1)   eventUpdate.id_event_category = idEventCategory;
        else                        error = "El id de la categoría del evento no es válido.";
    }

    if (!error && typeof body?.id_event_location === "number") {
        const idEventLocation = parseInt(body?.id_event_location, 10);
        if (idEventLocation >= 1)   eventUpdate.id_event_location = idEventLocation;
        else                        error = "El id de la locación del evento no es válido.";
    }

    if (!error) {
        if (typeof body?.start_date === "string") {
            const startDate = getDateOrDefault(body?.start_date, null);
            if (startDate !== null) eventUpdate.start_date = startDate;
            else                    error = "La fecha de inicio del evento no es válida.";
        } else if (body?.start_date === null) {
            eventUpdate.start_date = null;
        }
    }

    if (!error && typeof body?.duration_in_minutes === "number") {
        const durationInMinutes = parseInt(body?.duration_in_minutes, 10);
        if (durationInMinutes > 0)  eventUpdate.duration_in_minutes = durationInMinutes;
        else                        error = "La duración del evento debe ser un número mayor o igual a 0.";
    }

    if (!error) {
        if (typeof body?.price === "number") {
            const price = parseFloat(body?.price);
            if (price >= 0) eventUpdate.price = price;
            else            error = "El precio del evento no puede ser negativo.";
        } else if (body?.price === null) {
            eventUpdate.price = 0;
        }
    }

    if (!error && typeof body?.enabled_for_enrollment === "string")
        eventUpdate.enabled_for_enrollment = body?.enabled_for_enrollment;

    if (!error) {
        if (typeof body?.max_assistance === "number") {
            const maxAssistance = parseInt(body?.max_assistance, 10);
            const maxCapacity = await eventLocationService.getMaxCapacityById(eventUpdate.id_event_location);

            if (maxCapacity === null)
                error = "No existe la localización del evento.";
            else if (maxAssistance < 1 || maxAssistance > maxCapacity)
                error = "La asistencia debe ser un número mayor o igual a 1.";
            else
                eventUpdate.max_assistance = maxAssistance;
        } else if (body?.max_assistance === null) {
            eventUpdate.max_assistance = null;
        }
    }

    return error;
};