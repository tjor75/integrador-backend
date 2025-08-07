import * as eventRepository from "../repositories/event-repository.js";
import * as constants from "../configs/constants.js";

export const getAllAsync = async (pageNumber, filters) => {
    const events = await eventRepository.getAllAsync(pageNumber, constants.PAGE_LIMIT, filters);
    return events;
};

export const getByIdAsync = async (id) => {
    const event = await eventRepository.getByIdAsync(id);
    return event;
};

export const createAsync = async (event) => {
    const id = await eventRepository.createAsync(event);
    return id;
};

export const updateAsync = async (id, creatorUserId, eventUpdate) => { 
    const result = await eventRepository.updateAsync(id, creatorUserId, eventUpdate);
    return result;
};

export const deleteAsync = async (id, creatorUserId) => {
    const result = await eventRepository.deleteAsync(id, creatorUserId);
    return result;
};

export const getEnrollmentCountAsync = async (eventId) => {
    const count = await eventRepository.getEnrollmentCountAsync(eventId);
    return count;
}

export const checkEnrollmentAsync = async (eventId, userId) => {
    const check = await eventRepository.checkEnrollmentAsync(eventId, userId);
    return check;
}

export const enrollAsync = async (eventId, userId) => {
    const check = await eventRepository.doEnrollmentCheckAsync(eventId, userId);
    let badRequest = null;

    if (check === null)
        badRequest = "El evento no existe.";
    else if (check.current_enrollments >= check.max_assistance)
        badRequest = "El evento ha alcanzado su capacidad máxima de inscripciones.";
    else if (check.start_date <= new Date())
        badRequest = "No se puede inscribir a un evento que ya ha comenzado o que es hoy.";
    else if (!check.enabled_for_enrollment)
        badRequest = "El evento no está habilitado para inscripciones.";
    else if (check.user_already_enrolled !== null)
        badRequest = "El usuario ya se encuentra inscrito en el evento.";
    else
        await eventRepository.enrollAsync(eventId, userId);
    
    return badRequest;
};

export const unenrollAsync = async (eventId, userId) => {
    const check = await eventRepository.doUnenrollmentCheckAsync(eventId, userId);
    let badRequest = null;

    if (check === null)
        badRequest = "El evento no existe.";
    else if (check.start_date <= new Date())
        badRequest = "No se puede desinscribir de un evento que ya ha comenzado o que es hoy.";
    else if (!check.enabled_for_enrollment)
        badRequest = "El evento no está habilitado para inscripciones.";
    else if (check.user_already_enrolled === null)
        badRequest = "El usuario no se encuentra inscrito en el evento.";
    else
        await eventRepository.unenrollAsync(eventId, userId);

    return badRequest;
}