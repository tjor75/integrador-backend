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
            duration_in_minutes:    event.duration_in_minutes,
            price:                  event.price,
            enabled_for_enrollment: event.enabled_for_enrollment,
            creator_user: {
                id:         event.id_creator_user,
                first_name: event.first_name_creator_user,
                last_name:  event.last_name_creator_user
            },
            location: {
                id:         event.id_location,
                name:       event.name_location,
                longitude:  event.longitude_location,
                latitude:   event.latitude_location
            },
            name_tag: event.name_tag
        }
    });
    return formatedEvents;
};

const getByIdAsync = async (entity) => {
    const id = entity.id;
    let event = await eventRepository.getByIdAsync(id);
    if (event !== null)
        event = {
            id:                     event.id,
            name:                   event.name,
            description:            event.description,
            start_date:             event.start_date,
            duration_in_minutes:    event.duration_in_minutes,
            price:                  event.price,
            enabled_for_enrollment: event.enabled_for_enrollment,
            creator_user: {
                id:         event.id_creator_user,
                first_name: event.first_name_creator_user,
                last_name:  event.last_name_creator_user
            },
            event_location: {
                id:             event.id_event_location,
                name:           event.name_event_location,
                full_address:   event.full_address_event_location,
                max_capacity:   event.max_capacity_event_location,
                latitude:       event.latitude_event_location,
                longtiude:      event.longtiude_event_location,
                location: {
                    id:         event.id_location,
                    name:       event.name_location,
                    longitude:  event.longitude_location,
                    latitude:   event.latitude_location,
                    province: {
                        id:             event.id_province,
                        name:           event.name_province,
                        full_name:      event.full_name_province,
                        latitude:       event.latitude_province,
                        longtiude:      event.longitude_province,
                        display_order:  event.display_order_province
                    }
                },
            },
            tags: {},
            creator_user: {
                id:         event.id_creator_user,
                first_name: event.first_name_creator_user,
                last_name:  event.last_name_creator_user
            }
        };
    return event;
};

export { getPageAsync };