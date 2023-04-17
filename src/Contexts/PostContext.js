import React, { useState } from "react";
import { NOW, dateEqual, delay, weekEqual } from "../aFunctions";
import { UserRepository } from "./Repository";

export const PostContext = React.createContext();

export const PostProvider = ({children}) => {

    const getUserPost = async (user_fullname,id)=>{
        await delay(1000); 
        if(user_fullname===undefined || id===undefined) return undefined
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user===undefined) return undefined;
        return user.posts.find(post => post.id===id);
    }

    const getUserDayPosts = async (user_fullname)=>{
        await delay(1000); 
        if(user_fullname===undefined) return undefined
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user===undefined) return undefined;
        return user.posts.filter(post=> dateEqual(post.upload_date,NOW));
    }

    const getUserWeekPosts = async (user_fullname)=>{
        await delay(1000); 
        if(user_fullname===undefined ) return undefined
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user===undefined) return undefined;
        return user.posts?.filter(post=> weekEqual(post.upload_date,NOW));
    }

    //EXTRA
    const [hideIfAppsState,setHideIfAppsState2]=useState();
    const setHideIfAppsState=(user,team)=>{
        let diff = team.personalized_apps.filter(app => !user.personalized_apps.includes(app));
        setHideIfAppsState2(diff);
    }

    const value = {
        getUserPost,
        getUserDayPosts,getUserWeekPosts,
        hideIfAppsState,setHideIfAppsState
    }

    return ( 
    <PostContext.Provider value={value}>
        {children}
    </PostContext.Provider> );
}