import { isTime } from "../../aFunctions";

export const WeekDay = {"Monday":0, "Tuesday":1, "Wednesday":2, "Thursday":3, "Friday":4, "Saturday":5, "Sunday":6}

export const toWeekDay = (obj)=>{
  if(typeof obj === 'string')
    return WeekDay[obj];

  if(obj>=0 && obj<=6)
    return Object.keys(WeekDay).find(key => WeekDay[key] === obj)
  return undefined
}

export const dateToWeekDay = (date) =>{
  let index= (date.getDay()+6)%7;
  return toWeekDay(index);
}

export class Day {
    constructor(name,weekDay,sub,description=null,isSpecial=true,fromHour=0,toHour=24,fromWeek=0,note=null) { 
      this.name = name;
      this.weekDay = weekDay;
      this.sub= sub;
      this.description = description;
      this.note = note;
      this.isSpecial = isSpecial
      this.fromHour=fromHour
      this.toHour=toHour
      this.fromWeek = fromWeek;
    }

    static Default = new Day("Default",null," - ","just a casual day",false);
    
    static ClearMind = new Day("Clear-Mind",WeekDay.Monday,"PN 8",
    " - oczyść swoj umysl. Wejdź w nowy tydzień z najnowszym wydaniem Screenki Tygodnia i zacznij dzień z pozytywnym nastrojem.",false,8,24)

    static OhPreview = new Day("Oh-Preview",WeekDay.Wednesday,"SR 20 - 22",
    "- to podgląd losowego tygodnia jednego z uczestników.",false,20,22,2)

    static ThrowBack = new Day("Throw-Back",WeekDay.Friday,"PT 8 - 19",
    " - to czas wspomnień jednego tygodnia z przeszłości.",false,8,19,3)

    static DeadLine = new Day("Dead-Line",WeekDay.Sunday,"ND 20",
    " - zamykamy możliwość uploadowania. To czas oczekiwania na Screenkę Tygodnia! Do końca tego dnia możesz wspominać swój tydzień.",false,20,24)

    static OneShot = new Day("One-Shot",null, "* 19 - 20",
    " - to podgląd jednego z dzisiejszych postów uczestników... skomentuj swoje pierwsze wrażenie!",false,19,20,1,"* - codziennie");

    isTime = ()=>isTime(this.weekDay,this.fromHour,this.toHour)

    toString=()=> this.name.replace("-","").toLowerCase()

}