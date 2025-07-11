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
    const formatedEvents = events.map(event => {
        return {
            id:                     event.id,
            name:                   event.name,
            description:            event.description,
            start_date:             event.start_date,
            duration_in_minutes:    parseFloat(event.duration_in_minutes),
            price:                  parseFloat(event.price),
            enabled_for_enrollment: event.enabled_for_enrollment === "1",
            creator_user: {
                id:         event.id_creator_user,
                first_name: event.first_name_creator_user,
                last_name:  event.last_name_creator_user
            },
            location: {
                id:         event.id_location,
                name:       event.name_location,
                longitude:  parseFloat(event.longitude_location),
                latitude:   parseFloat(event.latitude_location)
            }
        }
    });
    return formatedEvents;
};

export { getPageAsync };