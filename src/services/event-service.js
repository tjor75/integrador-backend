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

const deleteAsync = async (id) => {
    const result = await eventRepository.deleteAsync(id);
    return result;
};

export { getAllAsync, getByIdAsync, createAsync, updateByIdAsync, deleteAsync };