import { isAfterTime, isTime, toWeekDay } from "../../aFunctions";
import { Event, EventViewsTill } from "./_Event";

export class DayEvent extends Event {
    constructor( name,weekDay,fromHour=0,toHour=24, description,for_=null,experience,fromWeekNumber=0) 
    { 
      super(name,description,for_,fromWeekNumber,experience,1,weekDay===null? EventViewsTill.Day:EventViewsTill.Week)
      this.fromHour=fromHour
      this.toHour=toHour
    }
    
    isTime = ()=> isTime(this.weekDay,this.fromHour,this.toHour)
    isAfterTime = ()=>isAfterTime(this.weekDay,this.toHour)

    getSubtitle= ()=>{
      let day = this.weekDay? toWeekDay(this.weekDay).substring(0,3).toUpperCase() : "*";
      return this.toHour===24 ? `${day} ${this.fromHour}` : `${day} ${this.fromHour} - ${this.toHour}`;
    }

    getNote = ()=>{
        return this.weekDay?null:"* - codziennie";
    }
}