import React from "react";
import { NOW, dateEqual, delay, weekEqual } from "../aFunctions";
import { DEMONOW, UserRepository } from "./Repository";

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
        if(user_fullname==null) return null
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user==null) return null;
        return user.posts.filter(post=> dateEqual(post.upload_date,NOW));
    }

    const getUserWeekPosts = async (user_fullname,team_id=null,week_name=null)=>{
        await delay(1000); 
        if(user_fullname==null ) return null
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user==null) return null;
        return user.posts?.filter(post=> weekEqual(post.upload_date,NOW));
    }

    const getUserTeamWeekPosts = async (user_fullname,team_id,week_name)=>{
        await delay(1000); 
        if(user_fullname==null || team_id==null || week_name==null ) return undefined
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user===undefined) return undefined;
        return user.posts?.filter(post=> post.team_id===team_id && post.week_name===week_name);
    }

    // const getTeamWeekPosts ()=>{} // TO MUCH FOR DB

    //SETTERS

    const setUserPostComment = async (user_fullname,id, comment_user_fullname,comment=null)=>{
        //comment is already set return false
        delay(500);
        return true;
    }

    const value = {
        getUserPost,
        getUserDayPosts,getUserWeekPosts,getUserTeamWeekPosts,
        setUserPostComment,
    }

    return ( 
    <PostContext.Provider value={value}>
        {children}
    </PostContext.Provider> );
}


export const PostDemoProvider = ({children}) => {

    const getUserPost = async (user_fullname,id)=>{
        await delay(1000); 
        if(user_fullname===undefined || id===undefined) return undefined
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user===undefined) return undefined;
        return user.posts.find(post => post.id===id);
    }

    const getUserDayPosts = async (user_fullname)=>{
        await delay(1000); 
        if(user_fullname==null) return null
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user==null) return null;
        return user.posts.filter(post=> dateEqual(post.upload_date,DEMONOW));
    }

    const getUserWeekPosts = async (user_fullname,team_id=null,week_name=null)=>{
        await delay(1000); 
        if(user_fullname==null ) return null
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user==null) return null;
        return user.posts?.filter(post=> weekEqual(post.upload_date,DEMONOW));
    }

    const getUserTeamWeekPosts = async (user_fullname,team_id,week_name)=>{
        await delay(1000); 
        if(user_fullname==null || team_id==null || week_name==null ) return undefined
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user===undefined) return undefined;
        return user.posts?.filter(post=> post.team_id===team_id && post.week_name===week_name);
    }

    // const getTeamWeekPosts ()=>{} // TO MUCH FOR DB

    //SETTERS

    const setUserPostComment = async (user_fullname,id, comment_user_fullname,comment=null)=>{
        //comment is already set return false
        delay(500);
        return true;
    }

    const value = {
        getUserPost,
        getUserDayPosts,getUserWeekPosts,getUserTeamWeekPosts,
        setUserPostComment,
    }

    return ( 
    <PostContext.Provider value={value}>
        {children}
    </PostContext.Provider> );
}