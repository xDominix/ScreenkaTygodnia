import React from "react";
import { NOW, dayEqual, delay,  getMonday } from "../aFunctions";
import { HostRepository, DEMONOW, DEMONAME } from "./aLocalbase";
import { ScreenkaView, SpecialDay, Week } from "../Objects/Week";
import { db, getDoc, getDocs } from "./aFirebase";
import { Timestamp, onSnapshot } from "firebase/firestore";
import { setDoc, doc} from "firebase/firestore";

export const WeekContext = React.createContext();

export const WeekProvider = ({children}) => {

    const onWeekSnapshot = (host_id,week_name,onNext)=>{
        return onSnapshot(doc(db,"hosts",host_id,"weeks",week_name),(doc)=>{let doc_ = doc.data();doc_.id=doc.id;onNext(Week.fromDoc(doc_))});
    }

    const getHostWeek = async (host_id,week_name=null)=>{ //return week or null or undefined
       if(host_id==null) return null;
        if(week_name!=null)
        {
            let doc =  await getDoc(`hosts/${host_id}/weeks`,week_name);
            //let special_days = await getDocs(`hosts/${host_id}/weeks/${week_name}/special_days`);
            //if(special_days) special_days = special_days.map(doc=>SpecialDay.fromDoc(doc));
            //let screenka_views = await getDocs(`hosts/${host_id}/weeks/${week_name}/screenka_views`);
            //if(screenka_views) screenka_views = screenka_views.map(doc=>ScreenkaView.fromDoc(doc));
            return Week.fromDoc(doc);
        }

        let docs = await  getDocs(`hosts/${host_id}/weeks`);
        let weeks = docs.map(doc=>Week.fromDoc(doc));
        
        let res = weeks?.find(week => dayEqual(getMonday(week.start_date),getMonday(NOW())));
        if(res==null)return null;

        /* let special_days = await getDocs(`hosts/${host_id}/weeks/${res.name}/special_days`);
        if(special_days) {
            special_days = special_days.map(doc=>SpecialDay.fromDoc(doc));
            res.special_days = special_days;    
        }*/
        /*let screenka_views = await getDocs(`hosts/${host_id}/weeks/${res.name}/screenka_views`);
        if(screenka_views) {
            screenka_views = screenka_views.map(doc=>ScreenkaView.fromDoc(doc));
            res.screenka_views=screenka_views
        }*/
        return res;
    }

    const getHostWeekNames=async(host_id,from_date=null)=>{
        let docs = await getDocs(`hosts/${host_id}/weeks`);
        let weeks = docs.map(doc=>Week.fromDoc(doc));
        if(weeks==null) return []
        weeks.filter(week=>NOW()>week.start_date && ( from_date==null || week.start_date > from_date) );
        return [...new Set(weeks.map(week => week.name))];
    }

    //special_days
    const getHostWeekSpecialDays = async (host_id,week_name)=>{
        let special_days = await getDocs(`hosts/${host_id}/weeks/${week_name}/special_days`);
        console.log(host_id,week_name,special_days)
        special_days = special_days?.map(doc=>SpecialDay.fromDoc(doc));
       return special_days;
    }
    //views
    const getHostWeekScreenkaViews = async (host_id,week_name)=>{
        let screenka_views = await getDocs(`hosts/${host_id}/weeks/${week_name}/screenka_views`);
        screenka_views = screenka_views?.map(doc=>ScreenkaView.fromDoc(doc));
       return screenka_views;
    }
    const setHostWeekScreenkaView = async (host_id,week_name,user_fullname)=>{
        await setDoc(doc(db,`hosts/${host_id}/weeks/${week_name}/screenka_views`,user_fullname),{
            view_date:Timestamp.fromDate(NOW()),
        })
        return true;
    }

    const value = {
        getHostWeek,getHostWeekNames,setHostWeekScreenkaView,getHostWeekScreenkaViews,getHostWeekSpecialDays,
        onWeekSnapshot
    }

    return ( 
    <WeekContext.Provider value={value}>
        {children}
    </WeekContext.Provider> );
}

export const WeekDemoProvider = ({children}) => {

    const onWeekSnapshot = (host_id,week_name,onNext)=>{
        let isSubscribed = true;

        async function subscribe() {
            while (isSubscribed) {
                let snapshot = await getHostWeek(host_id,week_name);
                snapshot=Object.assign({}, snapshot);
                await delay(3000);
                snapshot.apps_counts_map = new Map([["Spotify",2],["Maps",1],["Safari",1],["Camera",1]]);
                snapshot.latest_uploader = "Tola Bajka";
                snapshot.participants = [DEMONAME,"Mia Muller","Tola Bajka"];
                onNext(snapshot);

                isSubscribed=false;
            }
        }

        subscribe();

        return function unsubscribe() {
            isSubscribed = false;
        };
    }

    const getHostWeek = async (host_id,week_name=null)=>{ //return week or null or undefined
        await delay(500)

        if(week_name!=null)
            return HostRepository.find(host=>host.id===host_id).weeks
                ?.sort((week1,week2)=>{return week1.start_date-week2.start_date})
                ?.find(week=>week.name===week_name); //bierzemy ten ostatni stworzony o tej nazwie

        return HostRepository.find(host=>host.id===host_id).weeks
            ?.filter(week => dayEqual(getMonday(week.start_date),getMonday(DEMONOW)))
            ?.sort((week1,week2)=>{return week1.start_date-week2.start_date})
            ?.find(week => week.start_date<DEMONOW);
    }

    const getHostWeekNames=async (host_id,from_date=null)=>{
        await delay(1500)
        let host = HostRepository.find(host=>host.id === host_id)
        if(host==null) return null;
        if(host.weeks==null) return []
        let weeks = host.weeks.filter(week=>DEMONOW>week.start_date && ( from_date==null || week.start_date > from_date) );
        return [...new Set(weeks.map(week => week.name))];
    }

    //special_days
    const getHostWeekSpecialDays = async (host_id,week_name)=>{
        let week = await getHostWeek(host_id,week_name);
        
        return week.special_days;
    }

    //views
    const getHostWeekScreenkaViews = async (host_id,week_name)=>{
        let week = await getHostWeek(host_id,week_name);
        
        return week.screenka_views;
    }
    const setHostWeekScreenkaView = async (host_id,week_name,user_fullname)=>{
        //TODO
    }

    const value = {
        getHostWeek,getHostWeekNames,setHostWeekScreenkaView,getHostWeekScreenkaViews,getHostWeekSpecialDays,
        onWeekSnapshot
    }

    return ( 
    <WeekContext.Provider value={value}>
        {children}
    </WeekContext.Provider> );
}