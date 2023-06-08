import { CustomEvents, DayEvents } from "../../Services/aLocalbase";
import { NOW, isLessThenMinutes } from "../../aFunctions";
import { weekEqual } from "../../aFunctions";
import { dayEqual } from "../../aFunctions";
import { CustomEvent } from "./CustomEvent";
import { DayEvent } from "./DayEvent";

export const EventFor = {me:0,friends:1,screenka:2}
export const EventViewsTill ={Week:0,Day:1,FifteenMinutes:2}

export class Event {

    static getDayEvents = (weekNumber=0,for_, force_all=false) => this.#getEvents(DayEvents,weekNumber,for_,force_all);
    static getCustomEvents = (weekNumber=0,for_, force_all=false) =>  this.#getEvents(CustomEvents,weekNumber,for_,force_all);
    static #getEvents = (events,weekNumber=0,for_, force_all=false)=> force_all? events :( !for_ ? [] : events.filter((event)=> weekNumber>=event.fromWeekNumber && event.checkPermissions(for_)));

    static canViewPage = (event,props=null) =>{
        return event && event.hasPage && this.#isTime(event,props) && this.#canView(event);
    }

    static toString = (event)=> event.toString();
    static fromString = (string)=> {
        let day_event = DayEvent.fromString(string); if(day_event) return day_event;
        return CustomEvent.fromString(string);
    }

    static #isTime = (event,props=null) => event.isTime(props);

    static setView = (event) =>{ //returns true if newly created
        let clear_count =  isDiffTill(event);
        if(event.max_views) localStorage.setItem(`${event.toString()}_view`,NOW());
        if(event.max_views && event.max_views>1) {
            let count_str = localStorage.getItem(`${event.toString()}_count`);
            localStorage.setItem(`${event.toString()}_count`,(count_str && !clear_count) ?(Number(count_str)+1):1)
            return !count_str || clear_count;
        }
        return false;
    }

    static #canView = (event)=>{
        if(event.max_views==null || event.views_till==null) return true;

        if(event.max_views>1)   {
            let count_str = localStorage.getItem(`${event.toString()}_count`);
            if(!count_str || Number(count_str)< event.max_views) return true;
        }

        return isDiffTill(event);
    }


}

//czy jest roznica w weeku/dniu/minutach
const  isDiffTill = (event)=>{
    let date = localStorage.getItem(`${event.toString()}_view`); if(!date) return true;
    date = new Date(date);  

    switch(event.views_till) {
        case EventViewsTill.Week:
            return !weekEqual(date,NOW());
        case EventViewsTill.Day:
            return !dayEqual(date,NOW());
        case EventViewsTill.FifteenMinutes:
            return !isLessThenMinutes(date,15);
        default:
            return false;
    }
}