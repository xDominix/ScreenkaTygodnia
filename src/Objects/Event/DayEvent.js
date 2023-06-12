import { WeekDay, isTime, toWeekDay } from "../../aFunctions";

const EventFor = {me:0,friends:1,screenka:2}
const EventViewsTill ={Week:0,Day:1,FifteenMinutes:2}

export class DayEvent {
    constructor(
      name,weekDay, description,for_=null,fromWeekNumber=0,  //implements event
      hasPage= false,fromHour=0,toHour=24, extends_event=null
       ) { 
      this.name = name;
      this.weekDay = weekDay;
      this.description = description;
   
      this.hasPage = hasPage;
      
      this.fromHour=fromHour
      this.toHour=toHour
      this.fromWeekNumber = fromWeekNumber;
      
      this.extends_event = extends_event; //trzeba przed inicjalowac (jesli static)
      
      this.for = for_;

      //implements event
      this.max_views = 1;
      this.views_till = weekDay===null? EventViewsTill.Day:EventViewsTill.Week;
    }
    
      //mon
      static ClearMindForMe = new DayEvent("Clear-Mind",WeekDay.Monday,
      " - oczyść swój umysł. To nowy tydzień, nowy motyw, i nowe doznania!",EventFor.me,1,false,8,24)
      static ClearMind = new DayEvent("Clear-Mind",WeekDay.Monday,
      " - oczyść swój umysł. To nowy tydzień, nowy motyw i najnowsze wydanie Screenki Tygodnia!",EventFor.screenka,2,false,8,24,DayEvent.ClearMindForMe) //wazne zeby bylo ponizej classy statycznej

      //thu
      static OhPreview = new DayEvent("Oh-Preview",WeekDay.Thursday,
      " - oh! Przegląd poprzedniego tygodnia jednego z uczestników.",EventFor.friends,2,true,20,22)
      
      //fri
      static ThrowBack = new DayEvent("Throw-Back",WeekDay.Friday,
      " - cofaamy... czas wspomnień twojego, ostatniego tygodnia.",EventFor.friends,2,true,20,22)
      
      //sun
      static Reset = new DayEvent("Reset",WeekDay.Sunday, 
      " - re-set! Okazja na dostrojenie swoich ustawień preferencji.",EventFor.me,1,false,8,15); //HIDDEN - NO IN EVENTS ARRAY
      static WeekUploads = new DayEvent("Week-Uploads",WeekDay.Sunday,
      " - upload off!... a w tym czasie możesz powspominać swój tydzień.",EventFor.me,1,true,20,24)
      static DeadLine = new DayEvent("Dead-Line",WeekDay.Sunday,
      " - upload off! Screenka Tygodnia już w drodze... a w tym czasie możesz powspominać swój tydzień.",EventFor.screenka,1,false,20,24,DayEvent.WeekUploads) //wazne zeby bylo ponizej classy statycznej
      
       //everyday
      static OneShot = new DayEvent("One-Shot",null,
      " - szybki strzał. Jeden z dzisiejszych postów uczestników.",EventFor.friends,1,true,19,20);//Twoje pierwsze wrażenie?
      static MorningShot = new DayEvent("Morning-Shot",null,
      " - wake up! Jeden z twoich wczorajszych postów na dzień dobry.",EventFor.me,2,true,8,10);// Zerknij, poczuj i ruszaj... w nowy dzień.
      static DayUploads = new DayEvent("Day-Uploads",null,
        " - przeglądnij swój dzień na koniec dnia.",EventFor.me,0,true,20,24)
    
    checkPermissions = ({me,friends,screenka}) => (this.for === EventFor.me && me === true) ||  (this.for === EventFor.friends && friends === true)  ||  (this.for === EventFor.screenka && screenka === true); //implements event
    isTime = ()=> isTime(this.weekDay,this.fromHour,this.toHour) //implements event

    toString=()=> this.name.replace("-","").toLowerCase() //implements event

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