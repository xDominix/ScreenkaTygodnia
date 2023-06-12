import "./AboutWeek.css"
import React, { useContext, useMemo, useState } from 'react';
import { getMonday , isDayToday, MonthNames, WeekDay} from "../../../aFunctions";
import { BottomTabContext } from "../../../Contexts/BottomTabContext";
import A from "../../../Components/A";
import { ButtonPrevPage } from "../../../Components/Buttons";
import { AuthContext } from "../../../Contexts/AuthContext";

const AboutWeek = ({onClose}) => {
    const {setBottomTab,isBottomTab} = useContext(BottomTabContext);
    const {week,weekNumber,myDayEvents,friendsDisabled,screenkaDisabled,myRnShotEvent} = useContext(AuthContext);

    const everyDayEvents= useMemo(()=>myDayEvents.filter(day=>day.weekDay===null),[myDayEvents?.length])
    const weekDayEvents= useMemo(()=> Object.entries(WeekDay).map(([weekDayName,weekDayIndex])=>{return {day_name:weekDayName,events:myDayEvents.filter(event=>event.weekDay === weekDayIndex)}}),[myDayEvents?.length])

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
        let date = getMonday(week.start_date);
        let month_date_string =(MonthNames[date.getMonth()].toUpperCase()+" "+date.getFullYear());
        return (
        <footer>
            {month_date_string}<br/>
            TOTAL UPLOADS: {week.total_uploads}
        </footer>)
    },[week?.total_uploads])

    return (
        <div className={"aweek "+( isBottomTab()?'noclick aweek-blur-dark':"")}>
        <h1>
            <ButtonPrevPage onClick={onClose}/>
             {"#"+(weekNumber?weekNumber:0)} 
             <span className={"color-green-highlight"}>{week? week.name.toUpperCase(): "WEEK"}</span>{/* (week?.name.length>12 ? " spansmall":" span") */}
             {week && <span role="img" aria-label="emoji">{week.emoji}</span>}
        </h1>
        <div className="description initial-letter">{week?week.description:""}</div>
        <div className="aweek-calendar">
            <div className="aweek-rows">   

            {weekDayEvents.map(({day_name,events}) => 
            <div key={day_name}>
            
                <div>
                    {events.map((event,index)=> 
                    <A key={index} disabled={!event.checkPermissions({me:true,friends:!friendsDisabled,screenka:!screenkaDisabled})} nocolor={!isDayToday(WeekDay[day_name])} onClick={()=>handleDayNameClick(WeekDay[day_name],event)}>
                            {index!==0 && ", "}
                            {event.name.toUpperCase()}
                    </A>)}
                </div>

                <span 
                    className={"noselect "+(isDayToday(WeekDay[day_name])?"bcolor-green-solid color-black clickable":"bcolor-dark-gray-solid")} 
                    onClick={()=> ((week &&isDayToday(WeekDay[day_name]))? setIsDayLetter(!isDayLetter):{})}>
                        {spanDate( day_name)}
                </span>
            </div>
               )}

                <div >
                    <div>
                        {everyDayEvents.map((event,index)=> 
                        <A key={index} disabled={!event.checkPermissions({me:true,friends:!friendsDisabled,screenka:!screenkaDisabled})} onClick={()=>setBottomTab({id:3,object:event})}>
                                {index!==0 && ", "}
                                {event.name.toUpperCase()}
                        </A>)}
                    </div>
                    <span className="noselect bcolor-green-solid color-black"></span>
                </div>
            
                {myRnShotEvent &&<div>
                    <div><A nocolor className="color-orange"  disabled={!myRnShotEvent.checkPermissions({me:true,friends:!friendsDisabled,screenka:!screenkaDisabled})} onClick={()=>setBottomTab({id:3,object:myRnShotEvent})}>{myRnShotEvent.name.toUpperCase()}</A></div> 
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
