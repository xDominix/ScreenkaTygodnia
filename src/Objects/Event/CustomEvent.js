import { MAX_SCREENKA, WeekDay, isDayToday, isLessThenMinutes } from "../../aFunctions";
import { DayEvent } from "./DayEvent";

const EventFor = {me:0,friends:1,screenka:2}
const EventViewsTill ={Week:0,Day:1,FifteenMinutes:2}

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

    static Screenka = new CustomEvent("Screenka Tygodnia","- w skórcie ST, lokalna gazeta cotygodniowych wspomnień.",EventFor.screenka,2,MAX_SCREENKA,EventViewsTill.Week)

    static RnShot = new CustomEvent("Rn-Shot","- z ostatniej chwili! Najnowszy post innego uczestnika do 15min po jego dodaniu.",EventFor.friends,0,1,EventViewsTill.FifteenMinutes)

    static ManageUploads = new CustomEvent("Manage Uploads","- zarządzaj swoimi uploadami.",EventFor.me,0)
   

    checkPermissions = ({me,friends,screenka}) => (this.for === EventFor.me && me === true) ||  (this.for === EventFor.friends && friends === true)  ||  (this.for === EventFor.screenka && screenka === true); //implements event
    //implements event
    isTime = (props={})=> {
        switch(this){
            case(CustomEvent.Upload): //{}
                return !DayEvent.DeadLine.isTime() && ( DayEvent.ClearMind.isTime()|| !isDayToday(WeekDay.Monday) )
            case(CustomEvent.Screenka): //week (week=true cheat ;))
                return props.week!=null && (DayEvent.ClearMind.isTime() || props.week ===true || props.week.force_screenka)
            case(CustomEvent.RnShot): //date
                return props.date!=null && isLessThenMinutes(props.date,15);
            case(CustomEvent.ManageUploads):
                return true;
            default:
                return false;
            }
    }

    toString=()=> this.name.replace("-","").toLowerCase() //implements event

    getSubtitle= ()=>"";  //implements event
    getNote = ()=>"";   //implements event
}