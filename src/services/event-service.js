import * as eventRepository from '../repositories/event-repository.js';
import * as constants from '../configs/constants.js';

const getAllAsync = async (pageNumber, filters) => {
    const events = await eventRepository.getAllAsync(pageNumber, constants.PAGE_LIMIT, filters);
    return events;
};

const getByIdAsync = async (id) => {
    const event = await eventRepository.getByIdAsync(id);
    return event;
};

const createAsync = async (event) => {
    const id = await eventRepository.createAsync(event);
    return id;
};

const updateByIdAsync = async (id, idCreatorUser, eventUpdate) => { 
    const result = await eventRepository.updateByIdAsync(id, idCreatorUser, eventUpdate);
    return result;
};

const deleteAsync = async (id, creatorUserId) => {
    const result = await eventRepository.deleteAsync(id, creatorUserId);
    return result;
};

const getEnrollmentCountAsync = async (eventId) => {
    const count = await eventRepository.getEnrollmentCountAsync(eventId);
    return count;
}
/* const getEnrollmentsAsync = async (eventId) => {
    const enrollments = await eventRepository.getEnrollmentsAsync(eventId);
    return enrollments;
}; */

const checkEnrollmentAsync = async (eventId, userId) => {
    const check = await eventRepository.checkEnrollmentAsync(eventId, userId);
    return check;
}

const enrollAsync = async (eventId, userId) => {
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

    /*
    
    Remueve al usuario (autenticado) del evento enviado por parámetro.

Retorna un status code 200 (ok), sí se pudo remover de la suscripción.

Retorna un status code 400 (bad request) y un mensaje de error en los siguientes casos:

    El usuario no se encuentra registrado al evento.
    Intenta removerse de un evento que ya sucedió (start_date), o la fecha del evento es hoy.

Retorna un status code 401 (Unauthorized) y un mensaje de error en caso de que el usuario no se encuentre autenticado.

Retorna un status code 404 (not found) en caso de que el id sea inexistente.
*/

const unenrollAsync = async (eventId, userId) => {
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
};

export {
    getAllAsync,
    getByIdAsync,
    createAsync,
    updateByIdAsync,
    deleteAsync,
    getEnrollmentCountAsync,
    checkEnrollmentAsync,
    enrollAsync,
    unenrollAsync
};