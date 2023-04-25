import React from "react";
import { delay } from "../aFunctions";
import { DEMOUSERNAME, UserRepository } from "./Repository";

export const UserContext = React.createContext();

export const UserProvider = ({children}) => {

    const getUser = async (fullname)=>{
        await delay(1000); 
        if(fullname===undefined) return undefined
        return UserRepository.find(user=>user.fullname.toLowerCase()===fullname.toLowerCase())
    }

    const getUserByUsername = async (username)=>{ //returns undefined or null or user
        await delay(1000); 
        if(username===undefined) return undefined
        return UserRepository.find(user=>user.username.toLowerCase()===username.toLowerCase())
    }

    const trySetUsername = async (fullname,username,team_members=[])=>{
        if(username==null || username.length<=0 || username.length>20 )
           return false;

        let user = await getUser(fullname)
        if(user==null) throw new Error("Wrong your fullname")

        team_members.forEach(async(fullname) => {
            user = await getUser(fullname);
            if(user!=null) throw new Error("Wrong team_member fullname")

            if(user.username === username) return false;
        });

        //set
        
        delay(1000)
        return true;
    }


    const setPersonalizedApps = async (fullname,apps)=>{
        //set
        
        delay(1000)
    }

    const value = {
        getUser, getUserByUsername,
        trySetUsername,setPersonalizedApps
    }

    return ( 
    <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider> );
}


export const UserDemoProvider = ({children}) => {

    const getUser = async (fullname)=>{
        await delay(1000); 
        if(fullname===undefined) return undefined
        return UserRepository.find(user=>user.fullname.toLowerCase()===fullname.toLowerCase())
    }

    const getUserByUsername = async (username)=>{ //returns undefined or null or user
        await delay(1000); 
        if(username===undefined) return undefined
        return UserRepository.find(user=>user.username.toLowerCase()===DEMOUSERNAME.toLowerCase())
    }

    const trySetUsername = async (fullname,username,team_members=[])=>{
        if(username==null || username.length<=0 || username.length>20 )
           return false;

        let user = await getUser(fullname)
        if(user==null) throw new Error("Wrong your fullname")

        team_members.forEach(async(fullname) => {
            user = await getUser(fullname);
            if(user!=null) throw new Error("Wrong team_member fullname")

            if(user.username === username) return false;
        });

        //set
        
        delay(1000)
        return true;
    }


    const setPersonalizedApps = async (fullname,apps)=>{
        //set
        
        delay(1000)
    }

    const value = {
        getUser, getUserByUsername,
        trySetUsername,setPersonalizedApps
    }

    return ( 
    <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider> );
}
