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

export { getAllAsync, getByIdAsync, createAsync };