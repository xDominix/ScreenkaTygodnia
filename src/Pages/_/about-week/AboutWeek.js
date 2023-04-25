import "./AboutWeek.css"
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Day, WeekDay } from "../../../Objects/Day/Day";
import { getMonday , isDayToday, MonthNames} from "../../../aFunctions";
import { BottomTabContext } from "../../../Contexts/BottomTabContext";
import A from "../../../Components/A";

const AboutWeek = ({onClose,weekNumber,week}) => {
    const {setBottomTab,isBottomTab} = useContext(BottomTabContext);

    const [days,setDays] = useState([]);
    const [isDayLetter,setIsDayLetter] = useState(true)

    const loadAll = useCallback(()=>{
        let res =  [ Day.ClearMind,Day.DeadLine ]
        
        const days = [Day.OhPreview, Day.ThrowBack, Day.OneShot].filter((day) => !week.isDayOff(day));
        days.forEach(day => { res.push(day) });

        week.special_days.forEach(special_day => {
            res.push(special_day.toDay())
         });
        setDays(res);
    },[week])

    useEffect(()=>{
        loadAll()
    },[loadAll])

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
        let date = getMonday(week.start_date);
        return MonthNames[date.getMonth()].toUpperCase()+" "+date.getFullYear();
    }

    return (
        <div className={"aweek "+( isBottomTab()?'noclick aweek-blur-dark':"")}>
        <h1>
            <span className='week-span' onClick={onClose}>{"<"}</span>
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
                            <div key={key2} onClick={()=>handleDayNameClick(weekDayIndex,day)}>
                                    {key2!==0?", ":""}{day.name.toUpperCase()}
                            </div>)}
                        )    
                    }
                </div>}

                <span 
                    className={"noselect "+(isDayToday(weekDayIndex)?"bcolor-green-solid color-black clickable":"bcolor-dark-gray-solid")} 
                    onMouseDown={()=>handleDayLetterClick(weekDayIndex,true)} 
                    onMouseUp={()=>handleDayLetterClick(weekDayIndex,false)}
                    onMouseLeave={()=>handleDayLetterClick(weekDayIndex,false)}>
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
        <footer>{getFooter()}</footer>
        </div> 
    );
}
 
export default AboutWeek;
