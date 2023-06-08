import { MAX_SCREENKA, WeekDay, isDayToday, isLessThenMinutes } from "../../aFunctions";
import { DayEvent } from "./DayEvent";
import { EventFor, EventViewsTill, Event } from "./Event";

export class CustomEvent {
    constructor(name, description, for_=null,fromWeekNumber=0,//implements event
    max_views=null,views_till=null//implements event +
     ) {
        this.name = name;
        this.description = description;
        this.for = for_;
        this.fromWeekNumber = fromWeekNumber

        this.max_views = max_views;
        this.views_till =views_till;
       }

    static Upload = new CustomEvent("Upload","- uchwyć chwilę.",EventFor.me,0)

    static Screenka = new CustomEvent("Screenka Tygodnia","- w skórcie ST, lokalna gazeta cotygodniowych wspomnień.",EventFor.screenka,1,MAX_SCREENKA,EventViewsTill.Week)

    static RnShot = new CustomEvent("Rn-Shot","- z ostatniej chwili! Podglądnij ostatniego posta innego uczestnika do 15min po dodaniu.",EventFor.friends,0,1,EventViewsTill.FifteenMinutes)

    checkPermissions = ({me,friends,screenka}) => (this.for === EventFor.me && me === true) ||  (this.for === EventFor.friends && friends === true)  ||  (this.for === EventFor.screenka && screenka === true); //implements event
    //implements event
    isTime = (props={})=> {
        switch(this){
            case(CustomEvent.Upload): //{}
                return !DayEvent.DeadLine.isTime() && ( DayEvent.ClearMind.isTime()|| !isDayToday(WeekDay.Monday) )
            case(CustomEvent.Screenka): //week (week=true cheat ;))
                return props.week!=null && (DayEvent.ClearMind.isTime() || props.week.force_screenka)
            case(CustomEvent.RnShot): //date
                return props.date!=null && isLessThenMinutes(props.date,15);
            default:
                return false;
            }
    }

    toString=()=> this.name.replace("-","").toLowerCase() //implements event
    static fromString = (string)=> Event.getCustomEvents(null,null,true).find(event=>event.toString()===string); //implements event

    getSubtitle= ()=>"";  //implements event
    getNote = ()=>"";   //implements event
}