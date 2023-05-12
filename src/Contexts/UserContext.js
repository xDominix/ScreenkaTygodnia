import React from "react";
import { delay, getPath, } from "../aFunctions";
import { DEMOUSERNAME, UserRepository } from "./aLocalbase";
import { UserClass as User, UserClass} from "../Objects/User/UserClass";
import { doc, updateDoc } from "firebase/firestore";
import { db, getDoc, getDocWhere, getUserSrcFromStorage } from "./aFirebase";

export const UserContext = React.createContext();

export const UserProvider = ({children}) => {

    const getUser = async (fullname)=>{
        if(fullname==null) return null;
        if(sessionStorage.getItem("users/"+fullname)) 
        {
            let obj = JSON.parse(sessionStorage.getItem("users/"+fullname));
            return User.fromDoc(obj);
        }
        let doc = await getDoc("users",fullname);
        sessionStorage.setItem("users/"+fullname,JSON.stringify(doc));
        return User.fromDoc(doc);
    }

    const getUserByUsername = async (username)=>{ //returns undefined or null or user
        let doc = await getDocWhere("users","username",username);
        return UserClass.fromDoc(doc);
    }

    const trySetUsername = async (fullname,username,host_members=[])=>{
        if(username==null || username.length<=0 || username.length>20 )
           return false;

        let user = await getUser(fullname)
        if(user==null) throw new Error("Wrong your fullname")

        host_members.forEach(async(fullname) => {
            user = await getUser(fullname);
            if(user!=null) throw new Error("Wrong host_member fullname")

            if(user.username === username) return false;
        });

        await updateDoc(doc(db, "users",fullname),{username:username});

        return true;
    }


    const setPersonalizedApps = async (fullname,apps)=>{
        if(fullname ==null || apps==null) return false;
        await updateDoc(doc(db, "users",fullname),{personalized_apps:apps});
        return true;
    }

    const getUserSrcUrl = async (user_fullname)=>{
        if(user_fullname==null) return null;

        let sessionUrl =sessionStorage.getItem(user_fullname+"_src");
        if(sessionUrl) return new Promise((resolve, ) => { resolve(sessionUrl); });

        return getUserSrcFromStorage(user_fullname).then(url=>{
            sessionStorage.setItem(user_fullname+"_src",url);
            return url;
        })
    }

    const value = {
        getUser, getUserByUsername,
        trySetUsername,setPersonalizedApps,
        getUserSrcUrl
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

    const trySetUsername = async (fullname,username,host_members=[])=>{
        if(username==null || username.length<=0 || username.length>20 )
           return false;

        let user = await getUser(fullname)
        if(user==null) throw new Error("Wrong your fullname")

        host_members.forEach(async(fullname) => {
            user = await getUser(fullname);
            if(user!=null) throw new Error("Wrong host_member fullname")

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

    const getUserSrcUrl = async (user_fullname)=>{
        return getPath('default_profile_picture.png');
    }

    const value = {
        getUser, getUserByUsername,
        trySetUsername,setPersonalizedApps,getUserSrcUrl
    }

    return ( 
    <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider> );
}
