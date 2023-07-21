import "./AboutWeek.css"
import React, { useContext, useMemo, useState } from 'react';
import { getMonday , isDayToday, MonthNames, WeekDay} from "../../../aFunctions";
import { BottomTabContext } from "../../../Contexts/BottomTabContext";
import A from "../../../Components/A";
import { ButtonPrevPage } from "../../../Components/Buttons";
import { AuthContext } from "../../../Contexts/AuthContext";
import ScrollDiv from "../../../Components/ScrollDiv";

const AboutWeek = ({onClose}) => {
    const {setBottomTab,isBottomTab} = useContext(BottomTabContext);
    const {week,weekNumber,myDayEvents,disabledDayEvents,myCustomEvents} = useContext(AuthContext);

    //only events informative events
    const weekDayEvents= useMemo(()=> Object.entries(WeekDay).map(([weekDayName,weekDayIndex])=>{return {day_name:weekDayName,events:myDayEvents.filter(event=>event.weekDay === weekDayIndex).filter(event=> event.isInformative()),disabled_events:disabledDayEvents.filter(event=>event.weekDay === weekDayIndex).filter(event=> event.isInformative())}}),[myDayEvents?.length,disabledDayEvents?.length])
    const everyDayEvents= useMemo(()=>myDayEvents.filter(day=>day.weekDay===null).filter(event=> event.isInformative())  ,[myDayEvents?.length])
    const disabledEveryDayEvents= useMemo(()=>disabledDayEvents.filter(day=>day.weekDay===null).filter(event=> event.isInformative()) ,[disabledDayEvents?.length])
    const customEvents = useMemo(()=>myCustomEvents.filter(event=>event.isInformative()),[myCustomEvents])
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
        <ScrollDiv>
        <h1>
            <ButtonPrevPage onClick={onClose}>{"#"+(weekNumber?weekNumber:0)}</ButtonPrevPage>
            <span className={"color-blue-highlight"}>{week? week.name.toUpperCase(): "WEEK"}</span>{/* (week?.name.length>12 ? " spansmall":" span") */}
            {week && <span role="img" aria-label="emoji">{week.emoji}</span>}
        </h1>
        </ScrollDiv>
    
        <div className="description initial-letter">{week?week.description:""}</div>
        <div className="aweek-calendar">
            <div className="aweek-rows">   

            {weekDayEvents.map(({day_name,events,disabled_events}) => 
           <div key={day_name} >
                <div>
                    {events.map((event,index)=> 
                    <A key={index} active={!event.isAfterTime()} nocolor={!isDayToday(WeekDay[day_name])} onClick={()=>handleDayNameClick(WeekDay[day_name],event)}>
                            {index!==0 && ", "}
                            {event.name.toUpperCase()}
                    </A>)}
                    {disabled_events.map((event,index)=> 
                    <A key={index} nocolor={!isDayToday(WeekDay[day_name])} disabled>
                            {index!==0 && ", "}
                            {event.name.toUpperCase()}
                    </A>)}
                </div>

                <span 
                    className={"noselect circle "+(isDayToday(WeekDay[day_name])?"bcolor-green-solid color-black clickable":"bcolor-dark-gray-solid")} 
                    onClick={()=> ((week &&isDayToday(WeekDay[day_name]))? setIsDayLetter(!isDayLetter):{})}>
                        {spanDate( day_name)}
                </span>
            </div>
               )}

            <div>{/*EMPTY SLOT*/}
                <div></div> 
                <span className="noselect circle" style={{opacity:"0"}}></span>
            </div>
            
            {(everyDayEvents.length>0 || disabledEveryDayEvents.length>0) && <div style={{maxWidth:'100%'}}>
                <ScrollDiv >
                    {everyDayEvents.map((event,index)=> 
                    <A key={index} active={!event.isAfterTime()} onClick={()=>setBottomTab({id:3,object:event})}>
                            {index!==0 && ', '}
                            {event.name.toUpperCase()}
                    </A>)}
                    {disabledEveryDayEvents.map((event,index)=> 
                    <A key={index} disabled>
                            {index!==0 && ", "}
                            {event.name.toUpperCase()}
                    </A>)}
                </ScrollDiv>
                <span className="noselect bcolor-green-solid color-black circle"></span>
            </div>}
        
            {customEvents.length>0 &&<div>
                <ScrollDiv >
                    {customEvents.map((event,index)=> 
                    <A key={index} nocolor className="color-orange" onClick={()=>setBottomTab({id:3,object:event})}>
                        {index!==0 && ', '}
                        {event.name.toUpperCase()}
                    </A>)}
                </ScrollDiv>
                <span className="noselect bcolor-orange color-black circle"></span>
            </div>}
        
            </div>
            <div className="bcolor-dark-gray-solid"></div>
        </div>
        {footer}
        </div> 
    );
}
 
export default AboutWeek;