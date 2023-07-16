import { CustomEvents, DayEvents } from "./aLocalbase";

export const useEventService = (demo)=> demo===undefined ? null: EventService

const EventService = {
    getAvailableDayEvents : (weekNumber=0,for_, force_all=false) => {
        let arr = getAvailableEvents(DayEvents.values(),weekNumber,for_,force_all)
        return arr.filter((event,index) => arr.findIndex((e) => e.name === event.name) === index);
    }
    ,
    getAvailableCustomEvents : (weekNumber=0,for_, force_all=false) => {
        return getAvailableEvents(CustomEvents.values(),weekNumber,for_,force_all)
    }
};

const getAvailableEvents = (events,weekNumber=0,for_, force_all=false) => force_all? events : events.filter((event)=> event.isAvailable(weekNumber,for_));
