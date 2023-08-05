import { isAfterTime, isTime, toWeekDay } from "../../aFunctions";
import { Event, EventViewsTill } from "./_Event";

export class DayEvent extends Event {
    constructor( name,weekDay,fromHour=0,toHour=24, description,for_=null,fromWeekNumber=0,experience) 
    { 
      super(name,description,for_,fromWeekNumber,experience,1,weekDay===null? EventViewsTill.Day:EventViewsTill.Week)
      this.weekDay = weekDay;
      this.fromHour=fromHour
      this.toHour=toHour
    }
    
    isTime = ()=> isTime(this.weekDay,this.fromHour,this.toHour)
    isAfterTime = ()=>isAfterTime(this.weekDay,this.toHour)

    getSubtitle= ()=>{
      if(this.weekDay===null && this.fromHour===0 && this.toHour===24) return "*";
      let day = this.weekDay? toWeekDay(this.weekDay).substring(0,3).toUpperCase() :"*";
      return this.toHour===24 ?(this.fromHour===0? `${day}` :`${day} ${this.fromHour}:00`) : `${day} ${this.fromHour} - ${this.toHour}`;
    }

    getNote = ()=>{
      if(this.weekDay===null && this.fromHour===0 && this.toHour===24) return "* - all the time";
      if(this.fromHour===0 && this.toHour===24) return "* - whole day";
      if(this.weekDay===null)return "* - everyday";
      return null;
    }
}