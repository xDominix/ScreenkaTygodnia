import React from "react";
import { NOW, dateEqual, delay, getMonday } from "../aFunctions";
import { TeamRepository } from "./Repository";

export const WeekContext = React.createContext();

export const WeekProvider = ({children}) => {

    const getTeamWeek = async (team_id,week_name=null)=>{ //return week or null or undefined
        delay(300)

        if(week_name!=null)
            return TeamRepository.find(team=>team.id===team_id).weeks
                ?.sort((week1,week2)=>{return week1.start_date-week2.start_date})
                ?.find(week=>week.name===week_name); //bierzemy ten ostatni stworzony o tej nazwie

        return TeamRepository.find(team=>team.id===team_id).weeks
            ?.filter(week => dateEqual(getMonday(week.start_date),getMonday(NOW)))
            ?.sort((week1,week2)=>{return week1.start_date-week2.start_date})
            ?.find(week => week.start_date<NOW);
    }

    const getTeamWeekScreenkaViews = async (team_id,week_name)=>{
        let week = await getTeamWeek(team_id,week_name);
        
        return week.screenka_views;
    }
    const setTeamWeekScreenkaView = async (team_id,week_name,user_fullname)=>{
        //TODO
    }

    const value = {
        getTeamWeek, getTeamWeek,setTeamWeekScreenkaView,getTeamWeekScreenkaViews
    }

    return ( 
    <WeekContext.Provider value={value}>
        {children}
    </WeekContext.Provider> );
}