import { NOW, WeekDay, isTime, toWeekDay } from "../../aFunctions";
import { EventFor, EventViewsTill, Event } from "./Event";

export class DayEvent {
    constructor(
      name,weekDay, description,for_=null,fromWeekNumber=0,  //implements event
      hasPage= false,fromHour=0,toHour=24
       ) { 
      this.name = name;
      this.weekDay = weekDay;
      this.description = description;
   
      this.hasPage = hasPage;
      
      this.fromHour=fromHour
      this.toHour=toHour
      this.fromWeekNumber = fromWeekNumber;

      this.for = for_;

      //implements event
      this.max_views = 1;
      this.views_till = weekDay===null? EventViewsTill.Day:EventViewsTill.Week;
    }

      //screenka no_page
      static ClearMind = new DayEvent("Clear-Mind",WeekDay.Monday,
      " - oczyść swoj umysł. Wejdź w nowy tydzień z najnowszym wydaniem Screenki Tygodnia i zacznij dzień z pozytywnym nastrojem.",EventFor.screenka,0,false,8,24)
      static DeadLine = new DayEvent("Dead-Line",WeekDay.Sunday,
      " - uploadowanie wyłączone. Screenka Tygodnia już w drodze! W tym czasie możesz powspominać swój tydzień.",EventFor.screenka,0,false,20,24)
    
      //me no_page
      static WeekStart = new DayEvent("Week-Start",WeekDay.Monday, 
      " - oczyść swoj umysl. Wejdź w nowy tydzień z pozytywnym nastrojem.",EventFor.me,0,false,8,24)
      static Reset = new DayEvent("Reset",WeekDay.Sunday, 
      " - oczyść swoj umysl. Wejdź w nowy tydzień z pozytywnym nastrojem.",EventFor.me,0,false,8,19)

    //friends
    static OhPreview = new DayEvent("Oh-Preview",WeekDay.Wednesday,
    "- to podgląd ostatniego tygodnia jednego z uczestników.",EventFor.friends,2,true,20,22)
  static ThrowBack = new DayEvent("Throw-Back",WeekDay.Friday,
    " - to czas wspomnień twojego, ostatniego tygodnia.",EventFor.friends,2,true,8,19)
    static OneShot = new DayEvent("One-Shot",null,
      " - to podgląd jednego z dzisiejszych postów uczestników... skomentuj swoje pierwsze wrażenie!",EventFor.friends,1,true,19,20);
      
    //me
    static WeekUploads = new DayEvent("Week-Uploads",WeekDay.Sunday,"- upload wyłączony. W tym czasie możesz powspominać swój tydzień.",EventFor.me,0,true,20,24)
    static DayUploads = new DayEvent("Day-Uploads",null,"- przeglądnij swój dzień.",EventFor.me,0,true,0,24)
   
    checkPermissions = ({me,friends,screenka}) => (this.for === EventFor.me && me === true) ||  (this.for === EventFor.friends && friends === true)  ||  (this.for === EventFor.screenka && screenka === true); //implements event
    isTime = ()=> isTime(this.weekDay,this.fromHour,this.toHour) //implements event
    isAfterTime = ()=> NOW().getHours()>= this.toHour;

    toString=()=> this.name.replace("-","").toLowerCase() //implements event
    static fromString = (string)=> Event.getDayEvents(null,null,true).find(event=>event.toString()===string); //implements event

    //implements event
    getSubtitle= ()=>{
      let day = this.weekDay? toWeekDay(this.weekDay).substring(0,3).toUpperCase() : "*";
      return this.toHour===24 ? `${day} ${this.fromHour}` : `${day} ${this.fromHour} - ${this.toHour}`;
    }
    //implements event
    getNote = ()=>{
        return this.weekDay?null:"* - codziennie";
    }
}

/*
//only for me and friends day events
export class DayEventParams {
  constructor(randomUserSize,weekBack,daySize,dayRandom,postSize,postRandom, goBack=false){
    this.randomUserSize = randomUserSize;
    this.weekBack = weekBack;
    this.daySize = daySize;
    this.dayRandom = daySize===0?false: dayRandom;
    this.postSize = postSize;
    this.postRandom = postSize===0?false: postRandom;
    this.goBack = goBack;
  }

  
  static get =(event) =>{switch (event) {
    case DayEvent.ThrowBack:      return new DayEventParams(0,true,7,false,3,false)
    case DayEvent.OhPreview:      return new DayEventParams(1,true,7,true,3,false)
    case DayEvent.OneShot:          return new DayEventParams(3,false,0,false,1,true)
    case DayEvent.WeekUploads: return new DayEventParams(0,false,1,false,0,false,true)
    case DayEvent.DayUploads:    return new DayEventParams(0,false,0,false,0,false,true)
    default: return null;
  }}
}
*/