import React from "react";
import { NOW, dayEqual, delay,  getMonday } from "../aFunctions";
import { TeamRepository, DEMONOW } from "./aLocalbase";
import { ScreenkaView, SpecialDay, Week } from "../Objects/Week";
import { db, getDoc, getDocs } from "./aFirebase";
import { Timestamp } from "firebase/firestore";
import { setDoc, doc} from "firebase/firestore";

export const WeekContext = React.createContext();

export const WeekProvider = ({children}) => {

    const getTeamWeek = async (team_id,week_name=null)=>{ //return week or null or undefined
       if(team_id==null) return null;
        if(week_name!=null)
        {
            let doc =  await getDoc(`teams/${team_id}/weeks`,week_name);
            let special_days = await getDocs(`teams/${team_id}/weeks/${week_name}/special_days`);
            if(special_days) special_days = special_days.map(doc=>SpecialDay.fromDoc(doc));
            //let screenka_views = await getDocs(`teams/${team_id}/weeks/${week_name}/screenka_views`);
            //if(screenka_views) screenka_views = screenka_views.map(doc=>ScreenkaView.fromDoc(doc));
            return Week.fromDoc(doc,special_days);
    }

        let docs = await  getDocs(`teams/${team_id}/weeks`);
        let weeks = docs.map(doc=>Week.fromDoc(doc));
        
        let res = weeks?.find(week => dayEqual(getMonday(week.start_date),getMonday(NOW)));
        if(res==null)return null;
        let special_days = await getDocs(`teams/${team_id}/weeks/${res.name}/special_days`);
        if(special_days) {
            special_days = special_days.map(doc=>SpecialDay.fromDoc(doc));
            res.special_days = special_days;    
        }
        //let screenka_views = await getDocs(`teams/${team_id}/weeks/${res.name}/screenka_views`);
        //if(screenka_views) {
            //screenka_views = screenka_views.map(doc=>ScreenkaView.fromDoc(doc));
            //res.screenka_views=screenka_views
        //}
        return res;
    }

    const getTeamWeekNames=async(team_id,from_date=null)=>{
        let docs = await getDocs(`teams/${team_id}/weeks`);
        let weeks = docs.map(doc=>Week.fromDoc(doc));
        if(weeks==null) return []
        weeks.filter(week=>NOW>week.start_date && ( from_date==null || week.start_date > from_date) );
        return [...new Set(weeks.map(week => week.name))];
    }

    //views
    const getTeamWeekScreenkaViews = async (team_id,week_name)=>{
        let screenka_views = await getDocs(db,`teams/${team_id}/weeks/${week_name}/screenka_views`);
        screenka_views = screenka_views?.map(doc=>ScreenkaView.fromDoc(doc));
       return screenka_views;
    }
    const setTeamWeekScreenkaView = async (team_id,week_name,user_fullname)=>{
        await setDoc(doc(db,`teams/${team_id}/weeks/${week_name}/screenka_views`,user_fullname),{
            view_date:Timestamp.fromDate(NOW),
        })
        return true;
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
            ?.filter(week => dayEqual(getMonday(week.start_date),getMonday(DEMONOW)))
            ?.sort((week1,week2)=>{return week1.start_date-week2.start_date})
            ?.find(week => week.start_date<DEMONOW);
    }

    const getTeamWeekNames=async (team_id,from_date=null)=>{
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