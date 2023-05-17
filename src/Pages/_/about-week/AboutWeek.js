import "./AboutWeek.css"
import React, { useContext, useEffect, useState } from 'react';
import { Day, WeekDay } from "../../../Objects/Day/Day";
import { getMonday , isDayToday, MonthNames} from "../../../aFunctions";
import { BottomTabContext } from "../../../Contexts/BottomTabContext";
import A from "../../../Components/A";
import { ButtonPageBack } from "../../../Components/Buttons";

const AboutWeek = ({onClose,weekNumber,week}) => {
    const {setBottomTab,isBottomTab} = useContext(BottomTabContext);

    const [days,setDays] = useState([]);
    const [isDayLetter,setIsDayLetter] = useState(true)

    useEffect(()=>{
        let days = [Day.ClearMind,Day.DeadLine,Day.OhPreview, Day.ThrowBack, Day.OneShot].filter((day) =>  weekNumber>=day.fromWeek);
 
        week.getSpecialDays().forEach(special_day => {
            days.push(special_day)
         });
        setDays(days);
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    const getEveryDayDays= ()=>{return days.filter(day=>day.weekDay===null)}
    const getDefaultDayByWeekDay=(weekDay)=>{return days.filter(day=>day.weekDay===weekDay).at(0)}

    const handleDayNameClick =(weekDayIndex,day)=>{
        if(!isDayToday(weekDayIndex)) return;
        setBottomTab({id:3,object:day});
    }

    const handleDayLetterClick =(weekDayIndex,mouseDown)=>{
        if(!isDayToday(weekDayIndex)) return;
        setIsDayLetter(!mouseDown)
    }

    const getSpanDate = (weekDayName,weekDayIndex)=>{
        if(isDayLetter)  return weekDayName.charAt(0)
        let date = getMonday(week.start_date);
        date.setDate(date.getDate() + weekDayIndex)
        return date.getDate();
    }

    const getFooter = ()=>{
        let total_uploads = Array.from(week.apps_counts_map.values()).reduce((acc, value) => acc + value, 0);
        let total_uploads_string = "TOTAL UPLOADS: "+total_uploads;

        let date = getMonday(week.start_date);
        let full_date_string =(MonthNames[date.getMonth()].toUpperCase()+" "+date.getFullYear());
        return (<footer>{full_date_string}<br/>{total_uploads_string}</footer>)
    }

    return (
        <div className={"aweek "+( isBottomTab()?'noclick aweek-blur-dark':"")}>
        <h1>
            <ButtonPageBack onClick={onClose}/>
             {"#"+(weekNumber?weekNumber:0)} 
             <span className="color-green-highlight">{week.name.toUpperCase()}</span>
             <span role="img" aria-label="emoji">{week.emoji}</span>
        </h1>
        <div className="description initial-letter">{week.description}</div>
        <div className="aweek-calendar">
            <div className="aweek-rows">   

            {Object.entries(WeekDay).map(([weekDayName, weekDayIndex]) => {return ( 
            <div key={weekDayIndex}>
            
                { getDefaultDayByWeekDay(WeekDay[weekDayName]) && 
                <div style={{display:"flex"}} > 
                    {days.filter(day=>day.weekDay===WeekDay[weekDayName]).map((day,key2)=>{
                        if(isDayToday(weekDayIndex))  return(
                            <A key={key2} onClick={()=>handleDayNameClick(weekDayIndex,day)}>
                                    {key2!==0?", ":""}{day.name.toUpperCase()}
                            </A>)
                        else return (
                            <div key={key2}>
                                    {key2!==0?", ":""}{day.name.toUpperCase()}
                            </div>)}
                        )    
                    }
                </div>}

                <span 
                    className={"noselect "+(isDayToday(weekDayIndex)?"bcolor-green-solid color-black clickable":"bcolor-dark-gray-solid")} 
                    onMouseDown={()=>handleDayLetterClick(weekDayIndex,true)} 
                    onPointerDown={()=>handleDayLetterClick(weekDayIndex,true)} 
                    onMouseUp={()=>handleDayLetterClick(weekDayIndex,false)}
                    onPointerUp={()=>handleDayLetterClick(weekDayIndex,false)}
                    /*onMouseLeave={()=>handleDayLetterClick(weekDayIndex,false)}
                    onPointerLeave={()=>handleDayLetterClick(weekDayIndex,false)}*/>
                        {getSpanDate(weekDayName,weekDayIndex)}
                    </span>
            </div>
            )})}

        {getEveryDayDays().map((day,key) => { return (   
                    <div key={key}>
                        <A onClick={()=>setBottomTab({id:3,object:day})}>{day.name.toUpperCase()}</A>
                        <span className="bcolor-green-solid color-black"></span>
                    </div>
            )})}
        
            
            </div>
            <div className="bcolor-dark-gray-solid"></div>
        </div>
        {getFooter()}
        </div> 
    );
}
 
export default AboutWeek;
