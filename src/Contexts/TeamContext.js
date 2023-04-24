import React from "react";
import { NOW, datesWeekDelta, delay } from "../aFunctions";
import { DEMONOW, TeamRepository } from "./Repository";

export const TeamContext = React.createContext();

export const TeamProvider = ({children}) => {

    const getTeam = async (id)=>{
        if(id===undefined) return undefined
        delay(500)
        return TeamRepository.find(team=>team.id===id)
    }

    const getTeamMember = async (id,user_fullname)=>{
        if(id==null || user_fullname==null) return undefined;
        delay(500);
        return getTeam().then(team=> 
            team.members.find(member=>member.fullname === user_fullname))
    }

    const getTeamWeekNumber = (team)=>{
        return datesWeekDelta(team.start_date,NOW)
    }

    const value = {
        getTeam,getTeamMember,getTeamWeekNumber
    }

    return ( 
    <TeamContext.Provider value={value}>
        {children}
    </TeamContext.Provider> );
}

export default TeamProvider

export const TeamDemoProvider = ({children}) => {

    const getTeam = async (id)=>{
        if(id===undefined) return undefined
        delay(500)
        return TeamRepository.find(team=>team.id===id)
    }

    const getTeamMember = async (id,user_fullname)=>{
        if(id==null || user_fullname==null) return undefined;
        delay(500);
        return getTeam().then(team=> 
            team.members.find(member=>member.fullname === user_fullname))
    }

    const getTeamWeekNumber = (team)=>{
        return datesWeekDelta(team.start_date,DEMONOW)
    }

    const value = {
        getTeam,getTeamMember,getTeamWeekNumber
    }

    return ( 
    <TeamContext.Provider value={value}>
        {children}
    </TeamContext.Provider> );
}
