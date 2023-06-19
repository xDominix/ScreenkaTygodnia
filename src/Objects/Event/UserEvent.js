/**
 * 
 * DEMO FOR NOW
 * 
 */

import { DayEvent } from "./DayEvent";
import { EventFor, EventViewsTill } from "./Event";

export class UserEvent{
        constructor(day_event ) {
         this.name = day_event.name;
         this.weekDay = day_event.weekDay;
         this.description = day_event.description;
      
         this.hasPage = day_event.hasPage;
         
         this.fromHour=fromHour
         this.toHour=toHour
         this.fromWeekNumber = day_event.fromWeekNumber;
   
         this.for = day_event.for_;
   
         //implements event
         this.max_views = 1;
         this.views_till = day_event.weekDay===null? EventViewsTill.Day:EventViewsTill.Week;
         }

      static fromDoc=(doc)=>{
         if(!doc)return null;
         let event = new DayEvent(doc.id,doc.weekDay,doc.description,EventFor[doc.for],doc.fromWeekNumber,doc.hasPage,doc.fromHour,doc.toHour)
         event.max_views = doc.max_views;
         event.views_till = EventViewsTill[doc.views_till];
         return new UserEvent(event);
      }

      
      isTime = (props={})=> true; //implements event
      toString=()=> this.name.replace("-","").replace(" ","").toLowerCase() //implements event
      static fromString = (string)=> null; //implements event
      getSubtitle= ()=>null;  //implements event
      getNote = ()=>null;   //implements event
}