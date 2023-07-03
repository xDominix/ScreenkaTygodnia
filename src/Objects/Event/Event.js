import { GET_NOW, isLessThenMinutes } from "../../aFunctions";
import { weekEqual } from "../../aFunctions";
import { dayEqual } from "../../aFunctions";
import { CustomEvent } from "./CustomEvent";
import { DayEvent } from "./DayEvent";

export const EventFor = {me:0,friends:1,screenka:2}
export const EventViewsTill ={Week:0,Day:1,FifteenMinutes:2}


//kolejnosc ma znaczenie, wybieramy pierwszy result w home
const DayEvents = [
    DayEvent.ClearMind, DayEvent.ClearMindForMe, //mon
    DayEvent.OhPreview, //thu
    DayEvent.ThrowBack, //fri
    DayEvent.Reset,DayEvent.DeadLine,DayEvent.DeadLineForMe,DayEvent.WeekUploads, //sun
    DayEvent.MorningShot,  DayEvent.OneShot,DayEvent.DayUploads,  //everyday     //maja najmniejszy priorytet 
];

const CustomEvents = [
    CustomEvent.ManageUploads,
    CustomEvent.RnShot,
    CustomEvent.Screenka,
    CustomEvent.Upload,
];

const ShotEvents=[ DayEvent.MorningShot,DayEvent.OneShot,CustomEvent.RnShot];


export class Event {

    static getAvailableDayEvents = (weekNumber=0,for_, force_all=false) => {
        let arr = this.#getAvailableEvents(DayEvents,weekNumber,for_,force_all)
        return arr.filter((event,index) => arr.findIndex((e) => e.name === event.name) === index);
    }
    static getAvailableCustomEvents = (weekNumber=0,for_, force_all=false) => this.#getAvailableEvents(CustomEvents,weekNumber,for_,force_all);
    static #getAvailableEvents = (events,weekNumber=0,for_, force_all=false)=> force_all? events : events.filter((event)=>this.#isAvailable(event,weekNumber,for_));
    static #isAvailable = (event, weekNumber,for_) => !for_? false : (weekNumber>=event.fromWeekNumber && event.checkPermissions(for_));

    static toString = (event)=> event.toString();
    static fromString = (string)=> [...CustomEvents,...DayEvents].find(event=>event.toString()===string);

    static isShotType = (event) => ShotEvents.find(e=>e.name === event?.name);

    static canView = (event,props)=>{ //props for CustomEvents
        if(!event) return false;
        if(!event.isTime(props)) return false;
        if(event.max_views==null || event.views_till==null) return true;

        if(event.max_views>1)   {
            let count_str = localStorage.getItem(`${event.toString()}_count`);
            if(!count_str || Number(count_str)< event.max_views) return true;
        }
        return isDiffTill(event);
    }

    static setView = (event) =>{ //returns true if newly created
        if(event.max_views) localStorage.setItem(`${event.toString()}_view`,GET_NOW());
        if(event.max_views && event.max_views>1) {
            let clear_count =  isDiffTill(event);
            let count_str = localStorage.getItem(`${event.toString()}_count`);
            localStorage.setItem(`${event.toString()}_count`,(count_str && !clear_count) ?(Number(count_str)+1):1)
            return !count_str || clear_count;
        }
        return false;
    }
}

//czy jest roznica w weeku/dniu/minutach
const  isDiffTill = (event)=>{
    let date = localStorage.getItem(`${event.toString()}_view`); if(!date) return true;
    date = new Date(date);  

    switch(event.views_till) {
        case EventViewsTill.Week:
            return !weekEqual(date,GET_NOW());
        case EventViewsTill.Day:
            return !dayEqual(date,GET_NOW());
        case EventViewsTill.FifteenMinutes:
            return !isLessThenMinutes(date,15);
        default:
            return false;
    }
}