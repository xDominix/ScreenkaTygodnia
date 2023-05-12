import React from "react";
import { NOW, datesWeekDelta, delay, } from "../aFunctions";
import { DEMONOW, HostRepository } from "./aLocalbase";
import { Member, Host } from "../Objects/Host";
import { getDoc,getDocs } from "./aFirebase";
import { Timestamp } from "firebase/firestore";

export const HostContext = React.createContext();

export const HostProvider = ({children}) => {

    const getHost = async (id)=>{
        let doc = await getDoc("hosts",id);
        return Host.fromDoc(doc);
    }

    const getHostMembers = async (id)=>{
        if(id==null) return null;
        let docs = await  getDocs(`hosts/${id}/members`);
        return docs.map(doc=> Member.fromDoc(doc));
    }

     const getHostMember = async (id,user_fullname)=>{
        if(id==null || user_fullname==null) return null;
        if(localStorage.getItem(id+"/"+user_fullname)) 
        {
            let obj = JSON.parse(localStorage.getItem(id+"/"+user_fullname));
            obj.joined_date = new Timestamp(obj.joined_date.seconds,obj.joined_date.nanoseconds);
            return Member.fromDoc(obj);
        }
        let doc = await  getDoc(`hosts/${id}/members`,user_fullname);
        localStorage.setItem(id+"/"+user_fullname,JSON.stringify(doc));
        return Member.fromDoc(doc);
    }

    const getHostWeekNumber = (host)=>{
        if(host==null) return null;
        return datesWeekDelta(host.start_date,NOW())
    }

    const value = {
        getHost,getHostMembers,getHostMember,getHostWeekNumber
    }

    return ( 
    <HostContext.Provider value={value}>
        {children}
    </HostContext.Provider> );
}

export default HostProvider

export const HostDemoProvider = ({children}) => {

    const getHost = async (id)=>{
        if(id===undefined) return undefined
        await delay(500)
        return HostRepository.find(host=>host.id===id)
    }

    const getHostMembers = async (id)=>{
        if(id==null) return undefined;
        await delay(500);
        return getHost().members;
    }

    const getHostMember = async (id,user_fullname)=>{
        if(id==null || user_fullname==null) return undefined;
        await delay(500);
        let host =  await getHost(id);
        return host?host.members.find(member=>member.fullname===user_fullname):null;
    }

    const getHostWeekNumber = (host)=>{
        if(host==null) return null;
        return datesWeekDelta(host.start_date,DEMONOW)
    }

    const value = {
        getHost,getHostMembers,getHostMember,getHostWeekNumber
    }

    return ( 
    <HostContext.Provider value={value}>
        {children}
    </HostContext.Provider> );
}
