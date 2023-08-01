import { GET_NOW, isLessThenMinutes } from "../../aFunctions";
import { weekEqual } from "../../aFunctions";
import { dayEqual } from "../../aFunctions";

export const EventFor = {me:0,friends:1,screenka:2}
export const EventViewsTill ={Week:0,Day:1,FifteenMinutes:2}
export const EventExperience = { None:0, Informative:1 ,  Interactive:2 , Full:3}

export class Event {
    #experience;
    
    constructor(name, description="", for_=null, fromWeekNumber=0,experience=EventExperience.None, max_views=null, views_till=null) 
    {
        this.name = name;
        this.description = description;
        this.for = for_;
        this.fromWeekNumber = fromWeekNumber;
        this.#experience = experience;
        this.max_views = max_views;
        this.views_till = views_till;
    }

    checkPermissions = ({me,friends,screenka}) => (this.for === EventFor.me && me === true) ||  (this.for === EventFor.friends && friends === true)  ||  (this.for === EventFor.screenka && screenka === true);
    isTime = ()=> false;
    toString=()=> this.name.replace("-","").replace(" ","").toLowerCase()
    getSubtitle= ()=>"";
    getNote = ()=>null;

    isAvailable = (weekNumber,for_) => !for_? false : (weekNumber>=this.fromWeekNumber && this.checkPermissions(for_));
    isInformative = ()=> [EventExperience.Informative,EventExperience.Full].includes(this.#experience);
    isInteractive = ()=> [EventExperience.Interactive,EventExperience.Full].includes(this.#experience);

    //dlaczego static? ta sama nazwa eventu bedzie traktowana tak samo 
    //dlaczego tak chcemy robic? bo np. DeadLine, i DeadLineForMe to z definicji rozne eventy, a jednak maja wplywac na siebie (views).
    static canInteract = (event,props)=>{ //props for CustomEvents
        if(!event || !event.isInteractive()) return false;
        if(!event.isTime(props)) return false;
        if(event.max_views==null || event.views_till==null) return true;

        if(event.max_views>1)   {
            let count_str = localStorage.getItem(`${event}_count`);
            if(!count_str || Number(count_str)< event.max_views) return true;
        }
        return isDiffTill(event);
    }
    static setInteraction = (event) =>{ //returns true if newly created
        if(!event || !event.isInteractive()) return false;
        if(event.max_views) localStorage.setItem(`${event}_view`,GET_NOW());
        if(event.max_views && event.max_views>1) {
            let clear_count =  isDiffTill(event);
            let count_str = localStorage.getItem(`${event}_count`);
            localStorage.setItem(`${event}_count`,(count_str && !clear_count) ?(Number(count_str)+1):1)
            return !count_str || clear_count;
        }
        return false;
    }
}

//czy jest roznica w weeku/dniu/minutach
const  isDiffTill = (event)=>{
    let date = localStorage.getItem(`${event}_view`); if(!date) return true;
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