import "./AboutWeek.css"
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getMonday , isDayToday, MonthNames, toWeekDay, WeekDay} from "../../../aFunctions";
import { BottomTabContext } from "../../../Contexts/BottomTabContext";
import A from "../../../Components/A";
import { ButtonPrevPage } from "../../../Components/Buttons";
import { AuthContext } from "../../../Contexts/AuthContext";
import { DayEvent } from "../../../Objects/Event/DayEvent";
import { CustomEvent } from "../../../Objects/Event/CustomEvent";

const AboutWeek = ({onClose}) => {
    const {setBottomTab,isBottomTab} = useContext(BottomTabContext);
    const {week,weekNumber,myDayEvents,friendsDisabled,screenkaDisabled,isRnShotEvent} = useContext(AuthContext);

    const everyDayDays= useMemo(()=>myDayEvents.filter(day=>day.weekDay===null && day!==DayEvent.DayUploads),[myDayEvents?.length])
    const weekDayDays= useMemo(()=> Object.entries(WeekDay).map(([weekDayName,weekDayIndex])=>{return {day_name:weekDayName,event:myDayEvents.find(event=>event.weekDay === weekDayIndex)}}),[myDayEvents?.length])

    const [isDayLetter,setIsDayLetter] = useState(true)

    const handleDayNameClick =(day,event)=>{
        if(!isDayToday(day)) return;
        setBottomTab({id:3,object:event});
    }

    const spanDate = (weekDayName)=>{
        if(isDayLetter || !week)  return weekDayName.charAt(0);
        let date = getMonday(week.start_date);
        date.setDate(date.getDate() + WeekDay[weekDayName])
        return date.getDate();
    }

    const footer = useMemo(()=>{
        if(!week) return "";
        let total_uploads_string = "TOTAL UPLOADS: "+week.today_total_uploads;

        let date = getMonday(week.start_date);
        let full_date_string =(MonthNames[date.getMonth()].toUpperCase()+" "+date.getFullYear());
        return (<footer>{full_date_string}<br/>{total_uploads_string}</footer>)
    },[week?.today_total_uploads])

    return (
        <div className={"aweek "+( isBottomTab()?'noclick aweek-blur-dark':"")}>
        <h1>
            <ButtonPrevPage onClick={onClose}/>
             {"#"+(weekNumber?weekNumber:0)} 
             <span className="color-green-highlight">{week? week.name.toUpperCase(): "WEEK"}</span>
             {week && <span role="img" aria-label="emoji">{week.emoji}</span>}
        </h1>
        <div className="description initial-letter">{week?week.description:""}</div>
        <div className="aweek-calendar">
            <div className="aweek-rows">   

            {weekDayDays.map(({day_name,event}) => 
            <div key={day_name}>
                {event && <div >
                    <A disabled={!event.checkPermissions({me:true,friends:!friendsDisabled,screenka:!screenkaDisabled}) || (event.isAfterTime() &&isDayToday(WeekDay[day_name]))} nocolor={!isDayToday(WeekDay[day_name])} onClick={()=>handleDayNameClick(WeekDay[day_name],event)}>
                        {event.name.toUpperCase()}
                    </A>
                </div>}

                <span 
                    className={"noselect "+(isDayToday(WeekDay[day_name])?"bcolor-green-solid color-black clickable":"bcolor-dark-gray-solid")} 
                    onClick={()=> ((week &&isDayToday(WeekDay[day_name]))? setIsDayLetter(!isDayLetter):{})}>
                        {spanDate( day_name)}
                </span>
            </div>
               )}

            

        {everyDayDays.map((day,key) => { 
            return (   
                    <div key={key}>
                        <div><A disabled={!day.checkPermissions({me:true,friends:!friendsDisabled,screenka:!screenkaDisabled}) || day.isAfterTime()} onClick={()=>setBottomTab({id:3,object:day})}>{day.name.toUpperCase()}</A></div> 
                        <span className="noselect bcolor-green-solid color-black"></span>
                    </div>
            )})}

        {isRnShotEvent &&<div>
            <div><A nocolor className="color-orange"  disabled={!CustomEvent.RnShot.checkPermissions({me:true,friends:!friendsDisabled,screenka:!screenkaDisabled})} onClick={()=>setBottomTab({id:3,object:CustomEvent.RnShot})}>{CustomEvent.RnShot.name.toUpperCase()}</A></div> 
            <span className="noselect bcolor-orange color-black"></span>
        </div>}
        
            </div>
            <div className="bcolor-dark-gray-solid"></div>
        </div>
        {footer}
        </div> 
    );
}
 
export default AboutWeek;
