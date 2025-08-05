import * as eventLocationRepository from "../event-location-repository.js";

export const getMaxCapacityById = async (id) => {
    const maxCapacity = await eventLocationRepository.getMaxCapacityById(id);
    return maxCapacity;
};

export const getAllAsync = async (creatorUserId) => {
    const eventLocations = await eventLocationRepository.getAllAsync(creatorUserId);
    return eventLocations;
};

export const getByIdAsync = async (id, creatorUserId) => {
    const eventLocation = await eventLocationRepository.getByIdAsync(id, creatorUserId);
    return eventLocation;
};

export const createAsync = async (eventLocation) => {
    const id = await eventLocationRepository.createAsync(eventLocation);
    return id;
};

export const updateByIdAsync = async (id, creatorUserId, eventLocationUpdate) => {
    const result = await eventLocationRepository.updateByIdAsync(id, creatorUserId, eventLocationUpdate);
    return result;
};

export const deleteAsync = async (id) => {
    const result = await eventLocationRepository.deleteAsync(id);
    return result;
};