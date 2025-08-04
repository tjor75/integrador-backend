import * as eventLocationRepository from "../event-location-repository.js";

const getMaxCapacityById = async (id) => {
    const maxCapacity = await eventLocationRepository.getMaxCapacityById(id);
    return maxCapacity;
};

export { getMaxCapacityById };