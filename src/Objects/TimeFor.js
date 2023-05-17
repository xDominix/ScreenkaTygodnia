import { isDayToday, isLessThenMinutes } from "../aFunctions";
import { Day, WeekDay } from "./Day/Day";

//is it time for...
export class TimeFor {

    //home
    static Upload = () => !Day.DeadLine.isTime() && ( Day.ClearMind.isTime()|| !isDayToday(WeekDay.Monday) )
    
    //screenka
    static Screenka = (week) => week!=null && (Day.ClearMind.isTime() || week.force_screenka_show)
  
    //rnshot
    static RnShot = (date) => date!=null && isLessThenMinutes(date,15);

    //days
    static Day = (day, weekNumber) => day.isTime() && weekNumber!=null &&  weekNumber>=day.fromWeek;
    
    //pages
    static WeekUploads = () => Day.DeadLine.isTime();
    static DayUploads = () => true
  }

export default TimeFor