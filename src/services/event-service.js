import * as eventRepository from '../repositories/event-repository.js';
import * as constants from '../configs/constants.js';
import { getDateOrDefault, getSerialOrDefault } from "../helpers/validator-helper.js";

const getPageAsync = async(entity) => {
    const pageNumber = getSerialOrDefault(entity?.page_number, 1);
    const filters = {
        name: entity?.name ?? null,
        startDate: getDateOrDefault(entity?.startdate, null),
        tag: entity?.tag ?? null
    };
    const events = await eventRepository.getPageAsync(pageNumber, constants.PAGE_LIMIT, filters);
    return events;
};

const getByIdAsync = async (id) => {
    const event = await eventRepository.getByIdAsync(id);
    return event;
};

export { getPageAsync, getByIdAsync };