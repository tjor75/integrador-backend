import * as eventLocationRepository from "../repositories/event-location-repository.js";

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
    
export const updateAsync = async (id, creatorUserId, eventLocationUpdate) => {
    const result = await eventLocationRepository.updateAsync(id, creatorUserId, eventLocationUpdate);
    return result;
};
    
export const deleteAsync = async (id) => {
    const result = await eventLocationRepository.deleteAsync(id);
    return result;
};

export const locationExistsAsync = async (id) => {
    return await eventLocationRepository.existsLocationByIdAsync(id);
};

export const listLocationsWithProvinceAsync = async () => {
    return await eventLocationRepository.listLocationsWithProvinceAsync();
};