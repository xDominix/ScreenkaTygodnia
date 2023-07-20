import { MAX_SCREENKA, WeekDay, isDayToday, isLessThenMinutes } from "../../aFunctions";
import { DayEvent } from "./DayEvent";
import { Event, EventFor } from "./_Event";

export class CustomEvent extends Event {
    constructor(name,description,for_,fromWeekNumber,experience,isTimeFunction,max_views,views_till){
        super(name,description,for_,fromWeekNumber,experience,max_views,views_till)
        this.isTime =  (typeof isTimeFunction === 'function')? isTimeFunction: null;
    }
    
    isTime = (props={})=> this.isTime ? this.isTime(props) : null;
}