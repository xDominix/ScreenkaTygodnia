import { isDayToday, isLessThenMinutes } from "../aFunctions";
import { Day, WeekDay } from "./Day/Day";

//is it time for...
export class TimeFor {

    //home
    static Upload = (week) => !Day.DeadLine.isTime() && ( (week!=null && TimeFor.Screenka(week)) || !isDayToday(WeekDay.Monday) )
    
    //screenka
    static Screenka = (week) => week!=null && (Day.ClearMind.isTime() || week.force_screenka_show)
  
    //rnshot
    static RnShot = (post) => post!=null && isLessThenMinutes(post.upload_date,15);

    //days
    static Day = (day, week) => day.isTime() && week!=null &&!week.isDayOff(day);
    
    //pages
    static WeekUploads = () => Day.DeadLine.isTime()
    static DayUploads = () => true
  }

export default TimeFor