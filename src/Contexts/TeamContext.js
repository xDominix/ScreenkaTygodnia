import React from "react";
import { delay } from "../aFunctions";
import { TeamRepository } from "./Repository";

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

    const value = {
        getTeam,getTeamMember
    }

    return ( 
    <TeamContext.Provider value={value}>
        {children}
    </TeamContext.Provider> );
}

export default TeamProvider