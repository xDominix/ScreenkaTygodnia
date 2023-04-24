import React from "react";
import { NOW, dateEqual, delay, getMonday } from "../aFunctions";
import { TeamRepository, DEMONOW } from "./Repository";

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

    const getTeamWeekNames=(team_id,from_date=null)=>{
        delay(1500)
        let team = TeamRepository.find(team=>team.id === team_id)
        if(team==null) return null;
        if(team.weeks==null) return []
        let weeks = team.weeks.filter(week=>NOW>week.start_date && ( from_date==null || week.start_date > from_date) );
        return [...new Set(weeks.map(week => week.name))];
    }

    //views
    const getTeamWeekScreenkaViews = async (team_id,week_name)=>{
        let week = await getTeamWeek(team_id,week_name);
        
        return week.screenka_views;
    }
    const setTeamWeekScreenkaView = async (team_id,week_name,user_fullname)=>{
        //TODO
    }

    const value = {
        getTeamWeek, getTeamWeek,getTeamWeekNames,setTeamWeekScreenkaView,getTeamWeekScreenkaViews,
    }

    return ( 
    <WeekContext.Provider value={value}>
        {children}
    </WeekContext.Provider> );
}

export const WeekDemoProvider = ({children}) => {

    const getTeamWeek = async (team_id,week_name=null)=>{ //return week or null or undefined
        delay(300)

        if(week_name!=null)
            return TeamRepository.find(team=>team.id===team_id).weeks
                ?.sort((week1,week2)=>{return week1.start_date-week2.start_date})
                ?.find(week=>week.name===week_name); //bierzemy ten ostatni stworzony o tej nazwie

        return TeamRepository.find(team=>team.id===team_id).weeks
            ?.filter(week => dateEqual(getMonday(week.start_date),getMonday(DEMONOW)))
            ?.sort((week1,week2)=>{return week1.start_date-week2.start_date})
            ?.find(week => week.start_date<DEMONOW);
    }

    const getTeamWeekNames=(team_id,from_date=null)=>{
        delay(1500)
        let team = TeamRepository.find(team=>team.id === team_id)
        if(team==null) return null;
        if(team.weeks==null) return []
        let weeks = team.weeks.filter(week=>DEMONOW>week.start_date && ( from_date==null || week.start_date > from_date) );
        return [...new Set(weeks.map(week => week.name))];
    }

    //views
    const getTeamWeekScreenkaViews = async (team_id,week_name)=>{
        let week = await getTeamWeek(team_id,week_name);
        
        return week.screenka_views;
    }
    const setTeamWeekScreenkaView = async (team_id,week_name,user_fullname)=>{
        //TODO
    }

    const value = {
        getTeamWeek, getTeamWeek,getTeamWeekNames,setTeamWeekScreenkaView,getTeamWeekScreenkaViews,
    }

    return ( 
    <WeekContext.Provider value={value}>
        {children}
    </WeekContext.Provider> );
}